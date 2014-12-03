
Songbook.directive('chord', function() {
  return {
    restrict: 'E',
    scope: {
      chordname: '='
    },
    template: '<span class="chord"></span>',
    link: link
  };
  function link(scope, element, attrs) {
    var chord_chart = {
      'C': {
        name: "C Major",
        chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3]],
        position: 0,
        bars: []
      },
      'D': {
        name: "D Major",
        chord: [[1, 2], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
        position: 0,
        bars: []
      },
      'E': {
        name: "E Major",
        chord: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]],
        position: 0,
        bars: []
      },
      'G': {
        name: "G Major",
        chord: [[1, 3], [2, 3], [3, 0], [4, 0], [5, 2], [6, 3]],
        position: 0,
        bars: []
      },
      'A': {
        name: "A Major",
        chord: [[1, 0], [2, 2], [3, 2], [4, 2], [5, 0], [6, "x"]],
        position: 0,
        bars: []
      },
      'Dm': {
        name: "D Minor",
        chord: [[1, 1], [2, 3], [3, 2], [4, 0], [5, "x"], [6, "x"]],
        position: 0,
        bars: []
      },
      'Em': {
        name: "E Minor",
        chord: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]],
        position: 0,
        bars: []
      },
      'Am': {
        name: "A Minor",
        chord: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 0], [6, "x"]],
        position: 0,
        bars: []
      },
      'C7': {
        name: "C7",
        chord: [[1, 0], [2, 1], [3, 3], [4, 2], [5, 3], [6, "x"]],
        position: 0,
        bars: []
      },
      'D7': {
        name: "D7",
        chord: [[1, 2], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
        position: 0,
        bars: []
      },
      'E7': {
        name: "E7",
        chord: [[1, 0], [2, 3], [3, 1], [4, 0], [5, 2], [6, 0]],
        position: 0,
        bars: []
      },
      'G7': {
        name: "G7",
        chord: [[1, 1], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
        position: 0,
        bars: []
      },
      'A7': {
        name: "A7",
        chord: [[1, 0], [2, 2], [3, 0], [4, 2], [5, 0], [6, "x"]],
        position: 0,
        bars: []
      },
      'Dm7': {
        name: "Dm7",
        chord: [[1, 1], [2, 1], [3, 2], [4, 0], [5, "x"], [6, "x"]],
        position: 0,
        bars: []
      },
      'Em7': {
        name: "Em7",
        chord: [[1, 0], [2, 3], [3, 0], [4, 2], [5, 2], [6, 0]],
        position: 0,
        bars: []
      },
      'Am7': {
        name: "Am7",
        chord: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 0], [6, "x"]],
        position: 0,
        bars: []
      }
    };

    if (typeof chord_chart[attrs.chordname] !== 'undefined'){
      var paper = Raphael(element[0], 120, 120);
      var chord = new ChordBox(paper, 10, 10);

      // TODO: different chords
      chord.setChord(chord_chart[attrs.chordname].chord);
      chord.draw();
    }
  }
});
