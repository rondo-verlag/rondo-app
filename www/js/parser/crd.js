/*
CDR File Parser
Syntax Reference: http://tenbyten.com/software/songsgen/help/HtmlHelp/files_reference.htm
*/

//var lexer = new Lexer;
var Lexer = require('lex');

CRD_Parser = {
  parse: function(input){
    var lexer = new Lexer();
    lexer.setInput(input);

    // ----- Parse Rules -----
    lexer.addRule(/[^\{}\n\r\[\]:]+/, function (lexeme) {
      this.yytext = lexeme;
      return ["STRING", lexeme];
    });

    lexer.addRule(/(\n|\r|\r\n|\n\r)/, function (lexeme) {
      return ["NEWLINE"];
    });

    lexer.addRule(/(\n\n|\r\r|\r\n\r\n|\n\r\n\r)/, function (lexeme) {
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

    // ----- Build Structure -----
    var opening_tags = {
      'start_of_chorus': 'chorus',
      'soc': 'chorus',
      'start_of_tab': 'tab',
      'sot': 'tab'
    };
    var closing_tags = {
      'end_of_chorus': 'chorus',
      'eoc': 'chorus',
      'end_of_tab': 'tab',
      'eot': 'tab'
    };
    var structure = {
      'meta': [],
      'paragraphs': []
    }
    var current_paragraph = {'type':'default','lines':[]};
    var current_line = {'text': '', 'chords': []};
    var open_tags = ['default'];
    var token;
    while(true) {
      token = lexer.lex();
      if (typeof token == 'undefined'){
        break;
      }
      //console.log(token, '--', lexer.yytext);
      var value = lexer.yytext;

      switch (token) {
        case "DEFINITION":
          structure.meta.push({'attribute': value[0], 'value': value[1]});
          break;
        case "STRING":
          current_line.text += value;
          break;
        case "CHORD":
          current_line.chords.push([current_line.text.length, value]);
          break;
        case "NEWLINE":
          if (current_line.text != ''){
            current_paragraph.lines.push(current_line);
            current_line = {
              'text': '',
              'chords': []
            };
          }
          break;
        case "PARAGRAPH":
          if (current_line.text != '') {
            current_paragraph.lines.push(current_line);
            current_line = {
              'text': '',
              'chords': []
            };
          }
          if (current_paragraph.lines.length > 0) {
            structure.paragraphs.push(current_paragraph);
            current_paragraph = {
              'type': open_tags[open_tags.length-1],
              'lines':[]
            };
          }
          break;
        case "TAG":
          if (typeof opening_tags[value] !== 'undefined'){
            open_tags.push(opening_tags[value]);
            current_paragraph.type = opening_tags[value];
          }
          if (typeof closing_tags[value] !== 'undefined'){
            open_tags.pop();
          }
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
    return structure;
  }
}

if (typeof module === "object" && typeof module.exports === "object") module.exports = CRD_Parser;
