/*
CDR File Parser
Syntax Reference: http://tenbyten.com/software/songsgen/help/HtmlHelp/files_reference.htm
*/

//var lexer = new Lexer;
var lexerLib = require('lex');
var fs = require('fs')

fs.readFile('www/js/parser/__example.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);

  var lexer = new lexerLib();

  lexer.setInput(data);

  lexer.addRule(/[^\{}\n\r\[\]:]+/, function (lexeme) {
    this.yytext = lexeme;
    return ["STRING", lexeme];
  });

  lexer.addRule(/[\n\r]{1,2}/, function (lexeme) {
    return ["NEWLINE"];
  });

  lexer.addRule(/[\n\r]{3,}/, function (lexeme) {
    return ["PARAGRAPH"];
  });

  lexer.addRule(/\{[a-z_]+}/, function (lexeme) {
    var tag = lexeme.substring(0,lexeme.length-1).substring(1);
    this.yytext = tag;
    return "TAG";
  });

  lexer.addRule(/\{[a-z]+:[^}\n]+}/, function (lexeme) {
    var definition = lexeme.substring(0,lexeme.length-1).substring(1);
    var parts = definition.split(/:(.+)/);
    this.yytext = [parts[0], parts[1]];
    return "DEFINITION";
  });

  lexer.addRule(/\[[^\]]+]/, function (lexeme) {
    var chord = lexeme.replace('[','').replace(']','');
    this.yytext = chord;
    return "CHORD";
  });


  var structure = {
    'meta': [],
    'paragraphs': []
  }
  var current_paragraph = {'type':'default','lines':[]};
  var current_line = {'text': '', 'chords': []};
  var token;
  while(true) {
    token = lexer.lex();
    if (typeof token == 'undefined'){
      break;
    }
    console.log(token, '--', lexer.yytext);

    switch (token) {
      case "DEFINITION":
        structure.meta.push({'attribute': lexer.yytext[0], 'value': lexer.yytext[1]});
        break;
      case "STRING":
        current_line.text += lexer.yytext;
        break;
      case "CHORD":
        current_line.chords.push([current_line.text.length, lexer.yytext]);
        break;
      case "NEWLINE":
        if (current_line.text != ''){
          current_paragraph.lines.push(current_line);
          current_line = {'text': '', 'chords': []};
        }
        break;
      case "PARAGRAPH":
        if (current_line.text != '') {
          current_paragraph.lines.push(current_line);
          current_line = {'text': '', 'chords': []};
        }
        if (current_paragraph.lines.length > 0) {
          structure.paragraphs.push(current_paragraph);
          current_paragraph = {'type':'default','lines':[]};
        }
        break;
      case "TAG":
        current_paragraph.type = lexer.yytext;
        break;
      default:
        break;
    }
  }

  // add remaining lines
  if (current_line.text != '') {
    current_paragraph.lines.push(current_line);
  }
  if (current_paragraph.lines.length > 0) {
    structure.paragraphs.push(current_paragraph);
  }


  console.log(JSON.stringify(structure));

});
