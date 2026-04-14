import MidiPlayer from 'midi-player-js';
import Soundfont, { InstrumentName } from 'soundfont-player';

const GM_INSTRUMENT_NAMES: Record<number, InstrumentName> = {
  0: 'acoustic_grand_piano',
  1: 'bright_acoustic_piano',
  25: 'acoustic_guitar_nylon',
};

class MidiService {
  private audioContext: AudioContext | null = null;
  private player: InstanceType<typeof MidiPlayer.Player> | null = null;
  private instruments: Record<number, any> = {};
  private channelPrograms: Record<number, number> = {};
  private activeNotes: Record<string, any> = {};

  async play(midiUrl: string, onEnd: () => void): Promise<void> {
    this.stop();

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (Object.keys(this.instruments).length === 0) {
      await Promise.all(
        Object.entries(GM_INSTRUMENT_NAMES).map(async ([prog, name]) => {
          this.instruments[Number(prog)] = await Soundfont.instrument(
            this.audioContext!,
            name,
            { nameToUrl: (n: string) => `/assets/soundfonts/${n}-mp3.js` }
          );
        })
      );
    }

    const response = await fetch(midiUrl);
    const arrayBuffer = await response.arrayBuffer();

    this.channelPrograms = {};
    this.activeNotes = {};

    this.player = new MidiPlayer.Player((event: any) => {
      this.handleEvent(event);
    });

    this.player.on('endOfFile', onEnd);
    this.player.loadArrayBuffer(arrayBuffer);
    this.player.play();
  }

  stop(): void {
    if (this.player !== null) {
      this.player.stop();
      this.player = null;
    }
    Object.values(this.activeNotes).forEach((note: any) => {
      try { note.stop(); } catch (_) { /* ignore */ }
    });
    this.activeNotes = {};
  }

  private handleEvent(event: any): void {
    if (!this.audioContext) return;
    const prog = this.channelPrograms[event.channel] ?? 0;
    const instrument = this.instruments[prog] ?? this.instruments[0];
    if (!instrument) return;

    if (event.name === 'Note on' && event.velocity > 0) {
      const key = `${event.channel}-${event.noteNumber}`;
      if (this.activeNotes[key]) this.activeNotes[key].stop();
      this.activeNotes[key] = instrument.play(
        String(event.noteNumber),
        this.audioContext.currentTime,
        { gain: event.velocity / 127 }
      );
    } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
      const key = `${event.channel}-${event.noteNumber}`;
      if (this.activeNotes[key]) {
        this.activeNotes[key].stop();
        delete this.activeNotes[key];
      }
    } else if (event.name === 'Program Change') {
      this.channelPrograms[event.channel] = event.value;
    }
  }
}

export default new MidiService();
