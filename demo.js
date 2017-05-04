(function() {

  angular
    .module('mdColorPickerDemo', ['mdColorMenu'])
    .config(addPaletteIcon)
    .controller('DemoController', DemoController);

  function addPaletteIcon($mdIconProvider) {
    $mdIconProvider
      .icon("palette", 'img/ic_palette.svg')
  }

  function DemoController(mdPickerColors) {
    this.color = mdPickerColors.getColor('#D32F2F');
    this.openColorPicker = function (ev) {
      mdPickerColors.openColorPicker(ev, function(color) {
        console.log(color);
      });
    }
  }

})();
