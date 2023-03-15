export default interface ISong {
  id: number;
  title: string;
  pageRondoRed: number|null;
  pageRondoBlue: number|null;
  pageRondoGreen: number|null;
  pageRondo2017: number|null;
  pageRondo2021: number|null;
  interpret: string;
  chords: string[];
  alternative: boolean;
  free: boolean;
  license: string;
}
