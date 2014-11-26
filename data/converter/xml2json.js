
var fs = require('fs');

var MusicXML2JSON = function(inputFile, outputFile) {
  var rawJSON = loadXMLDoc(inputFile);

  fs.writeFile(outputFile,rawJSON, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });

  function loadXMLDoc(filePath) {
    var fs = require('fs');
    var xml2js = require('xml2js');
    var json;
    try {
      var fileData = fs.readFileSync(filePath, 'utf-8');

      var parser = new xml2js.Parser({'strict': false});
      parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
        json = JSON.stringify(result);
        console.log('Result:', result, err, result["SCORE-PARTWISE"]["WORK"][0]['WORK-TITLE']);
      });

      console.log("File '" + filePath + "' was successfully read.\n");
      return json;
    } catch (ex) {console.log(ex)}
  }
};

var basedir = '../';
var xmldir = basedir + 'musicxml/';
var jsondir = basedir + 'musicjson/';

fs.readdir(xmldir, function(err, files){
  files = files.filter(function(file) { return file.substr(-4) === '.xml'; });
  files.forEach(function(file) {
    var newfilename = file.substr(0, file.lastIndexOf(".")) + ".json";
    MusicXML2JSON(xmldir + file, jsondir + newfilename);
  });
});

