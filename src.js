$(document).ready(function () {

var canvas = document.getElementById('notation');
var context = canvas.getContext('2d');
context.translate(0.5, 0.5);
var backgroundColor = '#fffff0';
var marginWidth = 40;
var height = $('#notation').height();
console.log(height);

var startOfBars = [];
$( "#input_textarea" ).keyup(function() {
  //drawTab($('#input_textarea').val() );
  parseInputString(($('#input_textarea').val()));
});


var guitarStrings = [];
//define 'stave' as the 6 strings of tab notation
var numStaves = 8;
var numStrings = 6;
var firstStringPosition = -80;
var barWidth;
var timeSignatureGap = barWidth / 4;

/* define vertcal position of lines
 [set of strings][string] */
var defineStringPositions = function() {
  var stringGap = 24;
  var staveGap = 192;
  //var totalStrings =  numStaves * numStrings;
  var currentStave = 0;

  for(var i=0; i < (numStaves * numStrings); i++) {
    var currentString = i % 6;
    if( currentString === 0) {
      currentStave++;
    }
    //console.log(currentStave, currentString, (currentStave * currentString));
    guitarStrings[i] = firstStringPosition + (currentStave * staveGap)
                      + (currentString * stringGap);
  }
  //console.log(guitarStrings);
}

var defineBarPositions = function() {
  var leftMargin = getLeftMargin();
  var rightMargin = getRightMargin();
  var staveWidth = rightMargin - leftMargin;

  var annotationInset = 70; //a space to put time sig etc
  var fourBarsWidth = staveWidth - annotationInset;
  barWidth = fourBarsWidth / 4;

  startOfBars[0] = leftMargin + annotationInset;
  startOfBars[1] = startOfBars[0] + barWidth;
  startOfBars[2] = startOfBars[1] + barWidth;
  startOfBars[3] = startOfBars[2] + barWidth;
}
/*
var isOneOrTwoDigits = function(chars) {
  var substring = chars[0].concat(chars[1]);
  var oneDigit = /^\d+$/;
  var twoDigit = /^\d\d+$/;
  if( oneDigit.test(chars) || twoDigit.test())
}
*/
var getTimeSignatureGap = function( notesToBar ) {
  return barWidth / notesToBar;
}

var isDigit = function(string) {
  return /^\d+$/.test(string);
}

 var isValidTimeSig = function(string) {
   return /^{\d+}$/.test(string);
 }

var parseInputString = function(inputString) {
  clearNotation();
  drawAllLines();
  // showBarGuidelines();

  //SPLIT BY SPACE TOKEN
  var atoms = inputString.split(' ');
  var cursor;

  var resetCursor = function() {
    cursor = startOfBars[0] + (timeSignatureGap / 2);
    console.log(cursor);
  };
  resetCursor();


  var currentStringPos = guitarStrings[0];
  var currentStaveOffset = 0.0;
  var inChordMode = false;


  var printNotes = function(index) {
    // context.strokeStyle = 'orange';
    // context.beginPath();
    // context.moveTo(cursor, 50);
    // context.lineTo(cursor, height);
    // context.stroke();
    // context.closePath();
    // strokeStyle = 'black';

    drawNote(atoms[i].substring(1), cursor, currentStringPos );
    if(!inChordMode) {
      cursor += timeSignatureGap;

    }
  }


  for( var i=0; i < atoms.length; i++) {
    if( atoms[i].substring(0,1) === 'e' ) {
      currentStringPos = guitarStrings[0 + currentStaveOffset];
      printNotes(i);
    }
    else if ( atoms[i].substring(0,1) === 'b' ) {
      currentStringPos = guitarStrings[1 + currentStaveOffset];
      printNotes(i);

    }
    else if ( atoms[i].substring(0,1) === 'g' ) {
      currentStringPos = guitarStrings[2 + currentStaveOffset];
      printNotes(i);

    }
    else if ( atoms[i].substring(0,1) === 'd' ) {
      currentStringPos = guitarStrings[3 + currentStaveOffset];
      printNotes(i);

    }
    else if( atoms[i].substring(0,1) === 'a' ) {
      currentStringPos = guitarStrings[4 + currentStaveOffset];
      printNotes(i);

    }
    else if( atoms[i].substring(0,1) === 'E' ) {
      currentStringPos = guitarStrings[5 + currentStaveOffset];
      printNotes(i);

    }
    else if( atoms[i].substring(0,1) === 'r' ) {
      //rest note; skip a position
      cursor += timeSignatureGap;
    }
    else if( (atoms[i].substring(0,1) === '{') && (isDigit(atoms[i].substring(1, 2)))
              && (atoms[i].slice(-1) === '}') ) {
      var timeSig = atoms[i].substring(1,2);
      var timeString = 'current time signature: ' + timeSig.toString() + '/4';
      timeSignatureGap = getTimeSignatureGap(parseInt(timeSig));
      drawNote(timeString, leftMargin + 25, 25);
    }
    else if( (atoms[i].substring(0,1) === '[')) {
      inChordMode = true;
    }
    else if( (atoms[i].substring(0,1) === ']')) {
      inChordMode = false;
      cursor += timeSignatureGap;
    }
    else if( atoms[i] === 'N' ) {
      currentStaveOffset += 6;
      //console.log(currentStaveOffset);
      resetCursor();
    }
    //console.log(timeSignatureGap)
  }
};

var clearNotation = function() {
  context.clearRect(0.0, 0.0,
    $('#notation').width(),
    $('#notation').height()
  );
};

var getLeftMargin = function() {
  return marginWidth;
}

var getRightMargin = function() {
  var width = $('#notation').width();
  var rightMargin = width - marginWidth;
  return rightMargin;
}

var drawAllLines = function() {
  clearNotation();
  var leftMargin = getLeftMargin();
  var rightMargin = getRightMargin();
  for(var i=0; i < guitarStrings.length; i++) {
    context.lineWidth = 1.0;
    context.beginPath();
    context.moveTo(leftMargin, guitarStrings[i]);
    context.lineTo(rightMargin, guitarStrings[i]);
    context.stroke();
    context.closePath();
  }
  //draw the bar dividers
  for(var i=0; i < guitarStrings.length; i++) {
    var CurrentTop;
    var CurrentBottom;
    var barEnds = startOfBars.slice(1,4);
    //console.log(barEnds);

    if(i % 6 === 0) {
      currentTop = guitarStrings[i];
    }
    else if(i % 6 === 5) {
      currentBottom =  guitarStrings[i];
      for(var j=0; j < barEnds.length; j++) {
        context.beginPath();
        context.moveTo(barEnds[j], currentTop );
        context.lineTo(barEnds[j], currentBottom);
        context.stroke();
        context.closePath();
      }
    }
  }
  drawStringNotes();
};

var drawStringNotes = function() {
  //standrad tuning
  leftMargin = getLeftMargin();
  var notes = ['e', 'b', 'g', 'd', 'a', 'E'];
  for(var i=0; i < guitarStrings.length; i++ ) {
    var theString = i % 6;
    drawNote(notes[theString], leftMargin, guitarStrings[i]);
  }
}

var drawNote = function(noteString, x, y) {
  var textRectHeight = 20;
  var textRectWidthOneChar = textRectHeight;
  var textRectWidthTwoChar = textRectHeight * 1.3;
  var textLeftMargin;
  var textRectWidth;
  if(noteString.length === 1) {
    textRectWidth = textRectWidthOneChar;
    textLeftMargin = x - (textRectWidth / 4);
  } else if (noteString.length === 2) {
    textRectWidth = textRectWidthTwoChar;
    textLeftMargin =  x - (textRectWidth / 3);
  }
  var leftMargin = getLeftMargin();
  context.fillStyle = backgroundColor;
  context.font = '16px sans-serif';
  context.textBaseline = 'middle';

  context.fillRect(x - (textRectWidth / 2), y - (textRectHeight / 1.75),
                   textRectWidth, textRectHeight);
  context.fillStyle = 'black';
  context.fillText(noteString, textLeftMargin, y);

  /** just a test *****
  for(var i=0; i < guitarStrings.length; i++) {
    var randomInset = leftMargin + (Math.random() * 100);
    context.fillRect(randomInset - (textRectSize / 3), guitarStrings[i] - (textRectSize / 3),
                     textRectSize, textRectSize);
    context.strokeText('7', randomInset, guitarStrings[i]);
  }
  **/
}
var showBarGuidelines = function() {
  context.strokeStyle = 'red';

  context.beginPath();
  context.moveTo(leftMargin, 50);
  context.lineTo(leftMargin, height);
  context.stroke();
  context.closePath();

  for(var i=0; i<startOfBars.length; i++) {
    context.beginPath();
    context.moveTo(startOfBars[i], 50);
    context.lineTo(startOfBars[i], height);
    context.stroke();
    context.closePath();
  }
  context.strokeStyle = 'black';
}

var getKeyValue = function(keycode) {
  return String.fromCharCode((96 <= keycode && keycode <= 105)? (keycode - 48) : keycode);
}

//drawAllTabLines();
defineStringPositions();
defineBarPositions();
drawAllLines();
// showBarGuidelines();
///drawNote('8', 100, 100);

});
