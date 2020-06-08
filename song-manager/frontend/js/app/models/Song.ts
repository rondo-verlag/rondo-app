/// <reference path="../references.ts" />

module rondo {
  'use strict';

  export interface ISong {
    id: string;
    title: string;
    interpret: string;
    license: string;
    status: string;
    alternativeTitles?: string;
    text?: string;
    mood?: string;
    lang?: 'de'|'ch'|'fr'|'it'|'en'|'other'|null;
    pageRondoRed?: string;
    pageRondoBlue?: string;
    pageRondoGreen?: string;
    pageRondo2017?: string;
    pageRondo2021?: string;
    copyrightInfoApp?: string;
    copyrightInfoBook?: string;
    copyrightStatusApp?: string;
    copyrightStatusBook2017?: string;
    copyrightStatusBook2021?: string;
    releaseApp2017?: number;
    releaseBook2017?: number;
    releaseBook2021?: number;
    youtubeLink?: string;
    comments?: string;
    rawImageSize?: number;
    rawMidiSize?: number;
    rawNotesPDFSize?: number;
    rawSIBSize?: number;
    rawXMLSize?: number;
  }
}
