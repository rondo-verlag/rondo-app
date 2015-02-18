Songbook.filter('parenthesis', function() {
  return function(input) {
    if (input)
      return '(' + input + ')';
    return '';
  };
});