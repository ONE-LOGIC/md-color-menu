(function() {
  angular
    .module('mdColorMenu', ['ngAria', 'ngAnimate', 'ngMaterial'])
    .factory('mdPickerColors', ['$mdColorPalette', '$mdPanel', mdPickerColors])
    .directive('mdColorMenu', mdColorMenuDirective);

  function mdPickerColors($mdColorPalette, $mdPanel) {
    var service = {
      colors: [],
      getColor: getColor,
      setFavorites: setFavorites,
      getFavorites: getFavorites,
      openColorPicker: openColorPicker
    };

    var hexToColor = {};
    var favorites = [];

    angular.forEach($mdColorPalette, function(swatch, swatchName) {
      var swatchColors = [];
      angular.forEach(swatch, function(color, colorName) {
        if (isAccentColors(colorName) || isBlack(colorName))
          return;
        var foregroundColor = listToRgbString(color.contrast);
        var backgroundColor = listToRgbString(color.value);
        var name = swatchName + ' ' + colorName;
        var hex = listToHexString(color.value);
        var colorObject = {name: name, hex: hex, style: {'color': foregroundColor, 'background-color': backgroundColor}};
        swatchColors.push(colorObject);
        hexToColor[hex] = colorObject;
      });
      service.colors.push(swatchColors);
    });

    return service;

    function getColor(hex) {
      var colorObj = hexToColor[hex.toLowerCase()];
      if (colorObj === undefined) {
        colorObj = {
          name: hex,
          hex: hex,
          style: {
            'color': getFontColor(hex),
            'background-color': hexToRgb(hex)
          }
        };
      }
      return colorObj;
    }

    function getFontColor(hex) {
      const rgb = hexToRgb(hex, true);
      return (rgb[0] + rgb[1] + rgb[2]) / 3 > 127 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)';
    }

    function setFavorites(colorArray) {
      if (!Array.isArray(colorArray)) {
        throw new Error('mdColorPicker:setFavorites: Favorite colors need to be an Array.');
      }
      if (typeof colorArray[0] === 'string' || colorArray[0] instanceof String) {
        favorites = [colorArray.map(function (c) {
          return getColor(c);
        })];
      } else if (Array.isArray(colorArray[0])) {
        favorites = colorArray;
        favorites.forEach(function(color, index, fullColor) {
          if (color.length !== 10) {
            throw new Error('mdColorPicker:setFavorites: color needs to be an array with 10 colors.');
          }
          if (typeof color[0] === 'string' || color[0] instanceof String) {
            fullColor[index] = color.map(function (c) {
              return getColor(c);
            });
          }
        });
      } else {
        favorites = [colorArray];
      }
    }

    function getFavorites() {
      return favorites;
    }

    function isAccentColors(colorName) {
      return colorName[0] === 'A';
    }

    function hexToRgb(hex, returnAsArray) {
      // Expand shorthand form (e.g. "04F") to full form (e.g. "0044FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) {
        return null;
      }

      return returnAsArray ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')';
    }

    function isBlack(colorName) {
      return colorName === '1000';
    }

    function listToRgbString(rgbList) {
      if (rgbList.length === 4) {
        return 'rgba(' + rgbList.join(',') + ')';
      }
      return 'rgb(' + rgbList.join(',') + ')';
    }

    function listToHexString(rgbList) {
      return '#' + rgbList.map(toHex).join('');
    }

    function toHex(number) {
      var hex = number.toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      return hex;
    }

    function openColorPicker(ev, colorSelectedCallback) {

      var panelRef = { panel: null };

      var position = $mdPanel.newPanelPosition()
        .relativeTo(ev.srcElement)
        .addPanelPosition(
          $mdPanel.xPosition.ALIGN_START,
          $mdPanel.yPosition.BELOW
        );

      var config = {
        attachTo: angular.element(document.body),
        controller: angular.noop,
        controllerAs: 'vm',
        template: [
          '  <md-menu-content class="md-cm">',
          '    <div></div>',
          '    <div class="md-cm-swatches" layout="row">',
          '      <div ng-if="vm.favorites" ng-repeat="fColor in vm.favorites track by $index" layout="column" class="favorites">',
          '       <div ng-repeat="color in fColor track by $index" class="md-cm-color" ng-style="color.style" ng-click="vm.selectColor(color)" layout="row" layout-align="center center">',
          '         <span ng-if="color.name == vm.color.name">&#10004;</span>',
          '         <md-tooltip ng-if="vm.showTooltips">{{color.name}}</md-tooltip>',
          '         </div></div>',
          '      <div ng-repeat="swatch in vm.colors" layout="column">',
          '        <div ng-repeat="color in swatch" class="md-cm-color" ng-style="color.style" ng-click="vm.selectColor(color); vm.panelRef.panel.close();" layout="row" layout-align="center center">',
          '          <span ng-if="color.name == vm.color.name">&#10004;</span>',
          '         <md-tooltip ng-if="vm.showTooltips">{{color.name}}</md-tooltip>',
          '        </div>',
          '      </div>',
          '    </div>',
          '  </md-menu-content>'
        ].join(''),
        panelClass: 'md-color-picker-md-panel-class',
        position: position,
        locals: {
          panelRef: panelRef,
          colors: service.colors,
          selectColor: colorSelectedCallback,
          favorites: favorites
        },
        bindToController: true,
        openFrom: ev,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true,
        zIndex: 99,
        groupName: 'menus'
      };

      $mdPanel.open(config).then(function(result) {
        panelRef.panel = result;
      });
    }
  }

  function mdColorMenuDirective() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: mdColorMenuController,
      controllerAs: 'vm',
      bindToController: {
        color: '=',
        showTooltips: '=?'
      },
      template: [
        '<md-menu md-position-mode="target-right target">',
        '  <div ng-click="vm.openMenu($mdOpenMenu, $event)" ng-transclude=""></div>',
        '  <md-menu-content class="md-cm">',
        '    <div></div>',
        '    <div class="md-cm-swatches" layout="row">',
        '      <div ng-if="vm.favorites" ng-repeat="fColor in vm.favorites track by $index" layout="column" ng-class="{\'favorites\':$last}">',
        '        <div ng-repeat="color in fColor track by $index" class="md-cm-color" ng-style="color.style" ng-click="vm.selectColor(color)" layout="row" layout-align="center center">',
        '         <span ng-if="color.name == vm.color.name">&#10004;</span>',
        '         <md-tooltip ng-if="vm.showTooltips">{{color.name}}</md-tooltip>',
        '         </div></div>',
        '      <div ng-repeat="swatch in vm.colors" layout=column>',
        '        <div ng-repeat="color in swatch" class="md-cm-color" ng-style="color.style" ng-click="vm.selectColor(color)" layout="row" layout-align="center center">',
        '          <span ng-if="color.name == vm.color.name">&#10004;</span>',
        '          <md-tooltip ng-if="vm.showTooltips">{{color.name}}</md-tooltip>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </md-menu-content>',
        '</md-menu>'
      ].join('')
    }
  }

  mdColorMenuController['$inject'] = ['mdPickerColors'];
  function mdColorMenuController(mdPickerColors) {
    var vm = this;

    vm.showTooltips = vm.showTooltips || false;
    vm.openMenu = openMenu;
    vm.colors = mdPickerColors.colors;
    vm.selectColor = selectColor;
    vm.favorites = mdPickerColors.getFavorites();

    function openMenu($mdOpenMenu, $event) {
      $mdOpenMenu($event);
    }

    function selectColor(color) {
      vm.color = color;
    }
  }

  if (typeof module === 'object' && module.exports) {
	  module.exports = angular.module('mdColorMenu').name;
  }
})();
