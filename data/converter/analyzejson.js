
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
  var text_from_notes = ['','','','','','','','','',''];
  var chords_from_notes = [{},{},{},{},{},{},{},{},{},{}];
  var lines_from_notes = [];
  measures.forEach(function(measure) {
    var resetLine = false;

    // Chords
    if (measure['HARMONY']){
      measure['HARMONY'].forEach(function(harmony) {
        var step = harmony['ROOT'][0]['ROOT-STEP'][0];
        var kind_type = harmony['KIND'];
        var kind = '';
        if (kind_type == 'minor') {
          kind = 'm';
        }
        if (kind_type == 'dominant') {
          kind = '7';
        }
        // TODO: multiple
        var chord = step + kind;
        text_from_notes.forEach(function(text, i) {
          if (chords_from_notes[i][text.length]){
            chords_from_notes[i][text.length] = chords_from_notes[i][text.length] + '/' + chord;
          } else {
            chords_from_notes[i][text.length] = chord;
          }
        });
      });
    }

    // Texte in den Noten
    if (measure['NOTE']){
      measure['NOTE'].forEach(function(note) {
        if (note['LYRIC']){
          note['LYRIC'].forEach(function(lyric, i) {
            var hasSpace = false;
            if (lyric['SYLLABIC'] == 'single' || lyric['SYLLABIC'] == 'end'){
              hasSpace = true;
            }
            text_from_notes[i] += lyric['TEXT'][0] + (hasSpace?' ':'');
          });
        }

        if (note['REST']){
          //resetLine = true;
        }
      });
    }

    // BARLINE
    if (measure['BARLINE']){
      resetLine = true;
    }

    if (resetLine){
      text_from_notes.forEach(function(text, i) {
        if (text_from_notes[i].length > 0){
          lines_from_notes.push({
            text: text_from_notes[i],
            chords: chords_from_notes[i]
          });
          text_from_notes[i] = '';
          chords_from_notes[i] = {};
        }
      })
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
        lines: lines_from_notes
      }
  );

  console.log(song);
  console.log(structure);

  console.log(JSON.stringify(structure, undefined, 2));

  return JSON.stringify(structure, undefined, 2);
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