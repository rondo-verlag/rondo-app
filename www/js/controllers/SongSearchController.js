/*
 * View controller for the searchable song list.
 *
 */
Songbook.controller("SongSearchController", function($scope) {
  $scope.songs = [
    {'id': 'amazing_grace', name: 'Amazing Grace'},
    {'id': 'be_exalted', name: 'Be Exalted, O God'},
    {'id': 'before_you', name: 'Before You'},
    {'id': 'fire_of_god', name: 'Fire of God'}
  ]

});