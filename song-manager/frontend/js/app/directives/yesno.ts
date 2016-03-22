/// <reference path="../references.ts" />

module rondo.directives {
  'use strict';

  export function yesno(): ng.IDirective {
    return {
      templateUrl: 'frontend/js/app/directives/yesno.html',
      scope : {
        state: '='
      },
      restrict: 'E'
    };
  }
}