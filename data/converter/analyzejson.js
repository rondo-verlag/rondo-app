
var fs = require('fs');

var MusicJSON2JSON = function(song) {

  var structure = {
    meta: {},
    paragraphs: []
  };


  // remove root element
  song = song['SCORE-PARTWISE'];

  structure.meta.title = song['WORK'][0]['WORK-TITLE'][0];

  var measures = song['PART'][0]['MEASURE'];
  var text_from_notes = '';
  var chords_from_notes = {};
  measures.forEach(function(measure) {

    // Chords
    if (measure['HARMONY']){
      var step = measure['HARMONY'][0]['ROOT'][0]['ROOT-STEP'][0];
      var kind_type = measure['HARMONY'][0]['KIND'];
      var kind = '';
      if (kind_type == 'minor'){
        kind = 'm';
      }
      if (kind_type == 'dominant'){
        kind = '7';
      }
      var chord = step + kind;
      chords_from_notes[text_from_notes.length] = chord;
      //text_from_notes += '[' + chord + ']';
    }

    // Texte in den Noten
    if (measure['NOTE']){
      measure['NOTE'].forEach(function(note) {
        if (note['LYRIC']){
          var hasSpace = false;
          if (note['LYRIC'][0]['SYLLABIC'] == 'single' || note['LYRIC'][0]['SYLLABIC'] == 'end'){
            hasSpace = true;
          }
          text_from_notes += note['LYRIC'][0]['TEXT'][0] + (hasSpace?' ':'');
        }
      });
    }


    // Lyrics als Text
    if (measure['DIRECTION'] && measure['DIRECTION'][0]['DIRECTION-TYPE'][0]['WORDS']){
      var lines = measure['DIRECTION'][0]['DIRECTION-TYPE'][0]['WORDS'];
      var this_paragraph = {
        type: 'default',
        lines: []
      };
      lines.forEach(function(line) {
        this_paragraph.lines.push({ text: line['_'], chords: {}});
      });
      structure.paragraphs.push(this_paragraph);
    }



  });

  structure.paragraphs.unshift(
      {
        type: 'default',
        lines: [{
          text: text_from_notes,
          chords: chords_from_notes
        }]
      }
  );

  console.log(song);
  console.log(structure);

  console.log(JSON.stringify(structure));

  return JSON.stringify(structure);
}


var basedir = '../';
var inputdir = basedir + 'musicjson/';
var outputdir = basedir + 'json/';

fs.readdir(inputdir, function(err, files){
  files = files.filter(function(file) { return file.substr(-5) === '.json'; });
  files.forEach(function(file) {
    var fileData = fs.readFileSync(inputdir + file, 'utf-8');
    var json = MusicJSON2JSON(JSON.parse(fileData));
    fs.writeFile(outputdir + file,json, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });
  });
});