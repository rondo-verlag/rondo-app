/// <reference path="../references.ts" />

module rondo.directives {
  'use strict';

  export function status(): ng.IDirective {
    return {
      templateUrl: 'frontend/js/app/directives/status.html',
      scope : {
        status: '='
      },
      restrict: 'E'
    };
  }
}