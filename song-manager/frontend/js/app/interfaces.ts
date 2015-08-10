/// <reference path="references.ts" />

module rondo {
  export interface ISongDetailControllerScope extends ng.IScope {
    song: any;
    showAccords: boolean;
    uploader: any;
    uploadFile(object): void;
    save(): void;
    showList(): void;
    preview: any;
  }
}