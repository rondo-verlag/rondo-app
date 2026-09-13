import raw from 'assets/songdata/songs/song-index.json';
import ISongindex from '@/interfaces/ISongindex';

// Cast rather than let TypeScript infer the literal type of the whole
// (200+ entry) JSON file: checking that huge literal type against ISong
// in downstream `.filter()`/`.find()` callbacks blows up the type checker.
const songdata = raw as unknown as ISongindex;

export default songdata;
