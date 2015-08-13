/// <reference path="../references.ts" />

module rondo {
  'use strict';

  export interface ISong {
    id: number;
    title: string;
    isLicenseFree: number;
    alternativeTitles?: string;
    text?: string;
    pageRondoRed?: string;
    pageRondoBlue?: string;
    pageRondoGreen?: string;
    copyrightInfo?: string;
    comments?: string;
  }
}