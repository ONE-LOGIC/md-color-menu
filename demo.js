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

    mdPickerColors.setFavorites([
      '#5d5d5c',
      '#266478',
      '#86ceca',
      '#3b8985',
      '#8cbe9d',
      '#347849',
      '#bfdc80',
      '#6e8d25',
      '#bcc596',
      '#6d7748'
    ]);

    this.color = mdPickerColors.getColor('#D32F2F');
    this.openColorPicker = function (ev) {
      mdPickerColors.openColorPicker(ev, function(color) {
        console.log(color);
      });
    }
  }

})();
