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

    lexer.addRule(/\{[A-Za-z_]+}/, function (lexeme) {
      var tag = lexeme.substring(0,lexeme.length-1).substring(1);
      this.yytext = tag;
      return "TAG";
    });

    lexer.addRule(/\{[A-Za-z]+:[^}\n]+}/, function (lexeme) {
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
    var tag_map = {
      't': 'title',
      'su': 'subtitle',
      'soc': 'start_of_chorus',
      'eoc': 'end_of_chorus',
      'c': 'comment',
      'sot': 'start_of_tab',
      'eot': 'end_of_tab',
      'gc': 'guitar_comment',
      'ns': 'new_song',
      'np': 'new_page',
      'npp': 'new_physical_page',
      'colb': 'column_break'
    };
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
      'meta': {},
      'paragraphs': []
    }
    var current_paragraph = {'type':'default','lines':[]};
    var current_line = {'text': '', 'chords': {}};
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
          var tag = value[0];
          if(typeof tag_map[tag] !== 'undefined'){
            tag = tag_map[tag];
          }
          if(typeof structure.meta[tag] === 'undefined'){
            structure.meta[tag] = value[1];
          } else {
            structure.meta[tag] += "\n" + value[1];
          }
          break;
        case "STRING":
          current_line.text += value;
          break;
        case "CHORD":
          current_line.chords[current_line.text.length] = value;
          break;
        case "NEWLINE":
          if (current_line.text != ''){
            current_paragraph.lines.push(current_line);
            current_line = {
              'text': '',
              'chords': {}
            };
          }
          break;
        case "PARAGRAPH":
          if (current_line.text != '') {
            current_paragraph.lines.push(current_line);
            current_line = {
              'text': '',
              'chords': {}
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
