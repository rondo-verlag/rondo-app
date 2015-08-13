/// <reference path="../references.ts" />

module rondo.filters {
  'use strict';
  export function yesno() {
    return function(input) {
      return (input == 1 ? 'Ja' : 'Nein');
    }
  }
}
