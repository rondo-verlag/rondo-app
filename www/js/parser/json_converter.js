
var CRD_Parser = require('./crd.js');
var fs = require('fs')

if (typeof process.argv[2] === 'undefined'){
  return console.log('ERROR: No filename passed!');
}

var filename = process.argv[2];
var basepath = 'www/resources/songs/';
var file = basepath + 'crd/' + filename;

fs.exists(file, function(exists) {
  if (exists) {
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var structure = CRD_Parser.parse(data);

      var json = JSON.stringify(structure)
      //console.log(require('util').inspect(structure, true, 10));
      //console.log(json);
      var newfile = basepath + 'json/' + filename.substr(0, filename.lastIndexOf(".")) + ".json";
      fs.writeFile(newfile, json, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("The JSON file was saved: " + newfile);
        }
      });

    });

  } else {
    return console.log('File not found: '+file);
  }
});


