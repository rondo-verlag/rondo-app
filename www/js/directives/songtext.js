
Songbook.directive('songtext', function() {
  return {
    restrict: 'E',
    scope: {
      songdata: '='
    },
    template: '<div class="songtext">Songtext wird geladen...</div>',
    link: link
  };
  function link(scope, element, attrs) {
    scope.$watch("songdata",function(newValue,oldValue) {
      updateView(newValue, element);
    });
  }
  function updateView(data, element){
    console.log(data);
    var html = '';
    if (typeof data.paragraphs !== 'undefined' && data.paragraphs.length > 0){
      angular.forEach(data.paragraphs, function(para) {
        console.log(para);
        var paragraph_html = '';
        angular.forEach(para.lines, function(line) {
          console.log(line);
          var line_html = '';
          for (var i = 0, len = line.text.length; i < len; i++) {
            if(typeof line.chords[i] !== 'undefined'){
              line_html += '<span class="chord">'+line.chords[i]+'</span>';
            }
            line_html += line.text[i];
          }
          paragraph_html += '<div class="line">'+line_html+'</div>';
        });
        html += '<div class="paragraph p_'+para.type+'">' + paragraph_html + '</div>';
      });
      if(angular.isDefined(data.meta.comment)){
        html += '<div class="comment">'+data.meta.comment+'</div>';
      }
    } else {
      html = 'Loading...';
    }
    element.html('<div class="songtext">'+html+'</div>');
  }
});
