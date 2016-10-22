/// <reference path="../references.ts" />

module rondo.directives {
  'use strict';

  export function licensetype(): ng.IDirective {
    return {
      templateUrl: 'frontend/js/app/directives/licensetype.html',
      scope : {
        license: '='
      },
      restrict: 'E'
    };
  }
}