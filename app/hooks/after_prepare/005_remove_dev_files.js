#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

// clean folders from OS files
var foldersToProcess = [
    "js",
    "css",
    "css/fonts",
    "resources/songs/html",
    "resources/songs/images",
    "resources/songs/midi",
    "resources/songs/notes",
    "resources/songs/pdfs",
    "resources/songs",
    "templates"
];

var foldersToDelete = [
    "js/controllers/",
    "js/directives",
    "js/services"
];

var filesToDelete = [
    "css/style.scss",
    "css/rondo-icons.scss",
    "css/style.css.map",
    "js/app.ts",
    "js/app.js.map",
    "js/songbook.ts",
    "lib/ionic/js/ionic.js",
    "lib/ionic/js/ionic.bundle.js",
    "lib/ionic/js/ionic-angular.js",
    "lib/ionic/js/angular/angular.js",
    "lib/ionic/js/angular/angular-animate.js",
    "lib/ionic/js/angular/angular.js",
    "lib/ionic/js/angular-ui/angular-ui-router.js",
    "lib/ionic/fonts/ionicons.svg"

];

var iosPlatformsDir = "platforms/ios/www/";
var androidPlatformsDir = "platforms/android/assets/www/";

filesToDelete.forEach(function(file) {
    var filePathIOS = iosPlatformsDir + file;
    var filePathAndroid = androidPlatformsDir + file;
    if(fs.existsSync(filePathIOS)){
        fs.unlinkSync(filePathIOS);
    };
    if(fs.existsSync(filePathAndroid)){
        fs.unlinkSync(filePathAndroid);
    };
});

foldersToProcess.forEach(function(folder) {
    processFiles(iosPlatformsDir + folder);
    processFiles(androidPlatformsDir + folder);
});

foldersToDelete.forEach(function(folder) {
    deleteFolderRecursive(iosPlatformsDir + folder);
    deleteFolderRecursive(androidPlatformsDir + folder);
});

function deleteFolderRecursive(path){
    if( fs.existsSync(path) ) {
         fs.readdirSync(path).forEach(function(file,index){
             var curPath = path + "/" + file;
             if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
             } else { // delete file
                fs.unlinkSync(curPath);
             }
         });
         fs.rmdirSync(path);
    }
}

function processFiles(dir) {
    fs.readdir(dir, function(err, list) {
        if(err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if(!stat){
                  console.log('No files in folder, skipping: ' + file);
                  return;
                }
                if(!stat.isDirectory()) {
                    switch(path.basename(file)) {
                        case ".DS_Store":
                        case "Thumbs.db":
                        case "README.md":
                        case ".bower.json":
                        case "bower.json":
                            fs.unlink(file, function(error) {
                                console.log("Removed file " + file);
                            });
                            break;
                        default:
                            console.log("Skipping file " + file);
                            break;
                    }
                }
            });
        });
    });
}