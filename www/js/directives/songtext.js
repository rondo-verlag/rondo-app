
Songbook.directive('songtext', function($compile, $ionicPopover) {
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
      $compile(element.contents())(scope);
    });
    $ionicPopover.fromTemplateUrl('templates/chord-popover.html', {
      scope: scope
    }).then(function(popover) {
      scope.popover = popover;
    });

    scope.openPopover = function(event) {
      console.log(event.target.innerText);
      scope.selectedChord = event.target.innerText;
      scope.popover.show(event);
    };

    scope.closePopover = function() {
      scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    scope.$on('$destroy', function() {
      scope.popover.remove();
    });

    // Execute action on hide popover
    scope.$on('popover.hidden', function() {
      // Execute action
    });

    // Execute action on remove popover
    scope.$on('popover.removed', function() {
      // Execute action
    });
  }
  function updateView(data, element){
    //console.log(data);
    var html = '';
    if (typeof data.paragraphs !== 'undefined' && data.paragraphs.length > 0){
      angular.forEach(data.paragraphs, function(para) {
        //console.log(para);
        var paragraph_html = '';
        angular.forEach(para.lines, function(line) {
          //console.log(line);
          var line_html = '';
          var line_chord = '';
          var blocks = [];

          // iterate chars
          for (var i = 0, len = line.text.length; i <= len; i++) {

            // chords
            if(typeof line.chords[i] !== 'undefined'){
              blocks.push(wrapBlockHtml(line_html, line_chord))
              line_html = line_chord = '';
              line_chord = line.chords[i];
            }

            // new block on spaces to wrap text
            if(line.text[i] == ' ' || typeof line.text[i] == 'undefined'){
              line_html += '&nbsp;';
              blocks.push(wrapBlockHtml(line_html, line_chord))
              line_html = line_chord = '';
            } else {
              // chars
              line_html += line.text[i];
            }

          }
          blocks.push(wrapBlockHtml(line_html, line_chord))
          paragraph_html += '<div class="line clearfix">'+blocks.join('')+'</div>';
        });
        html += '<div class="paragraph p_'+para.type+'">' + paragraph_html + '</div>';
      });
      if(angular.isDefined(data.meta.comment)){
        html += '<div class="comment">'+data.meta.comment+'</div>';
      }
    }
    element.html('<div class="songtext">'+html+'</div>');
  }
  function wrapBlockHtml(html, chord){
    var chord_html = '<span class="empty-chord"></span>';
    if (chord){
      chord_html = '<span class="chord" ng-click="openPopover($event)">'+chord+'</span>';
    }
    return '<div class="bl">'+chord_html+html+'</div>';
  }
});
