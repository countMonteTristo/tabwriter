$(document).ready(function () {

var canvas = document.getElementById('notation');
var context = canvas.getContext('2d');

$( "#input_textarea" ).keyup(function() {
  drawTab();
});

var drawStrings = function() {
    var width = $('#notation').width();
    var height = $('#notation').height();
    var marginWidth = 20;
    var topMargin = 20;
    var stringGap = 10;

    var leftMargin = marginWidth;
    var rightMargin = width - marginWidth;

    var lineHeight;
    //for(var i=0; i++; i<3) {
      for(var j=0; j < 6; j++ ) {
        context.beginPath();
        lineHeight = topMargin + (j * stringGap);
        context.moveTo(leftMargin, lineHeight);
        context.lineTo(rightMargin, lineHeight);
        context.stroke();
        context.closePath();
      }
    //   topMargin = i * 50
    // }
}

var clearTab = function() {
  drawStrings();
}

var drawTab = function() {
  var current = document.getElementById('input_textarea').value;
  clearTab();
  context.fillText(current, 20, 20);
}

var getKeyValue = function(keycode) {
  return String.fromCharCode((96 <= keycode && keycode <= 105)? (keycode - 48) : keycode);
}

drawStrings();

});
