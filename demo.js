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
    this.color = mdPickerColors[0][7];
  }

})();