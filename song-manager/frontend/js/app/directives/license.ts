/// <reference path="../references.ts" />

module rondo.directives {
  'use strict';

  export function license(): ng.IDirective {
    return {
      templateUrl: 'frontend/js/app/directives/license.html',
      scope : {
        license: '='
      },
      restrict: 'E'
    };
  }
}