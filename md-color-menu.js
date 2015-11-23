(function() {

  angular
    .module('mdColorMenu', ['ngAria', 'ngAnimate', 'ngMaterial'])
    .factory('mdPickerColors', mdPickerColors)
    .directive('mdColorMenu', mdColorMenuDirective);

  function mdPickerColors($mdColorPalette) {
    var colors = [];

    angular.forEach($mdColorPalette, function(swatch, swatchName) {
      var swatchColors = [];
      angular.forEach(swatch, function(color, colorName) {
        if (isAccentColors(colorName) || isBlack(colorName))
          return;
        var foregroundColor = listToRgbString(color.contrast);
        var backgroundColor = listToRgbString(color.value);
        var name = swatchName + ' ' + colorName;
        var hex = listToHexString(color.value);
        swatchColors.push({name: name, hex: hex, style: {'color': foregroundColor, 'background-color': backgroundColor}});
      });
      colors.push(swatchColors);
    });

    return colors;

    function isAccentColors(colorName) {
      return colorName[0] === 'A';
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
      return number.toString(16);
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
        color: '='
      },
      template: [
        '<md-menu md-position-mode="target-right target">',
        '  <div ng-click="vm.openMenu($mdOpenMenu, $event)" ng-transclude=""></div>',
        '  <md-menu-content class="md-cm">',
        '    <div></div>',
        '    <div class="md-cm-swatches" layout="row">',
        '      <div ng-repeat="swatch in vm.colors" layout=column>',
        '        <div ng-repeat="color in swatch" class="md-cm-color" ng-style="color.style" ng-click="vm.selectColor(color)" layout="row" layout-align="center center">',
        '          <span ng-if="color.name == vm.color.name">&#10004;</span>',
        '          <md-tooltip>{{color.name}}</md-tooltip>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </md-menu-content>',
        '</md-menu>'
      ].join('')
    }
  }

  function mdColorMenuController(mdPickerColors) {
    var vm = this;

    vm.openMenu = openMenu;
    vm.colors = mdPickerColors;
    vm.selectColor = selectColor;

    function openMenu($mdOpenMenu, $event) {
      $mdOpenMenu($event);
    }

    function selectColor(color) {
      vm.color = color;
    }
  }

})();
