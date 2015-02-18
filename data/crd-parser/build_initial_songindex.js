var fs = require('fs')

var BASEPATH = 'www/resources/songs/';
var SONG_INDEX_NAME = 'song-index.json';
var songindex = [];

fs.readdir(BASEPATH + 'json/', function (err, files) {
  //console.log(files);
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    //console.log(file);
    if (file.substr(-4) === "json"){
      var obj = JSON.parse(fs.readFileSync(BASEPATH + 'json/' + file, 'utf8'));
      //console.log(obj.meta.title);
      var title = (obj.meta.title ? obj.meta.title : file);
      if (Math.random() < 0.85){
        title = title.toUpperCase();
      }
      songindex.push({
        id: file,
        name: title,
        page: Math.ceil(Math.random()*250)
      });
    }

  }
  console.log(songindex);

  fs.writeFile(BASEPATH+SONG_INDEX_NAME, JSON.stringify(songindex, null, 2), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("INDEX JSON saved to " + BASEPATH+SONG_INDEX_NAME);
    }
  });

});
