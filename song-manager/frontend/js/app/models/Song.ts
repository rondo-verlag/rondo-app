/// <reference path="../references.ts" />

module rondo {
  'use strict';

  export interface ISong {
    id: string;
    title: string;
    isLicenseFree: string;
    status: string;
    alternativeTitles?: string;
    text?: string;
    pageRondoRed?: string;
    pageRondoBlue?: string;
    pageRondoGreen?: string;
    copyrightInfo?: string;
    comments?: string;
    rawImageSize?: number;
    rawMidiSize?: number;
    rawNotesPDFSize?: number;
    rawSIBSize?: number;
    rawXMLSize?: number;
  }
}