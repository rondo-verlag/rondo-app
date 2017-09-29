/// <reference path="../references.ts" />

module rondo {
  'use strict';

  export interface ISong {
    id: string;
    title: string;
    license: string;
    status: string;
    alternativeTitles?: string;
    text?: string;
    pageRondoRed?: string;
    pageRondoBlue?: string;
    pageRondoGreen?: string;
    pageRondo2017?: string;
    copyrightInfoApp?: string;
    copyrightInfoBook?: string;
    comments?: string;
    rawImageSize?: number;
    rawMidiSize?: number;
    rawNotesPDFSize?: number;
    rawSIBSize?: number;
    rawXMLSize?: number;
  }
}