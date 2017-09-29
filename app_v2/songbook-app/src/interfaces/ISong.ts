interface ISong {
    id: string;
    title: string;
    pageRondoRed: string|null;
    pageRondoBlue: string|null;
    pageRondoGreen: string|null;
    pageRondo2017: string|null;
    interpret: string;
    chords: string[];
    alternative: boolean;
    free: boolean;
    license: string;
}