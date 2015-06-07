angular.module('RondoAppFilters', []).filter('yesno', function() {
  return function(input) {
    return (input == 1 ? 'Ja' : 'Nein');
  };
});