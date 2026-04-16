import MidiPlayer from 'midi-player-js';
import { Soundfont } from 'smplr';

const GM_INSTRUMENT_NAMES: Record<number, string> = {
  0: 'acoustic_grand_piano',
  1: 'bright_acoustic_piano',
  25: 'acoustic_guitar_nylon',
};

class MidiService {
  private audioContext: AudioContext | null = null;
  private player: InstanceType<typeof MidiPlayer.Player> | null = null;
  private instruments: Record<number, Soundfont> = {};
  private channelPrograms: Record<number, number> = {};
  private activeNotes: Record<string, () => void> = {};

  async play(midiUrl: string, onEnd: () => void): Promise<void> {
    this.stop();

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (Object.keys(this.instruments).length === 0) {
      Object.entries(GM_INSTRUMENT_NAMES).forEach(([prog, name]) => {
        this.instruments[Number(prog)] = new Soundfont(this.audioContext!, { instrument: name, volume: 126 });
      });
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
    Object.values(this.instruments).forEach((instrument) => {
      try { instrument.stop(); } catch (_) { /* ignore */ }
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
      if (this.activeNotes[key]) this.activeNotes[key]();
      this.activeNotes[key] = instrument.start({
        note: event.noteNumber,
        time: this.audioContext.currentTime,
        velocity: event.velocity,
      });
    } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
      const key = `${event.channel}-${event.noteNumber}`;
      if (this.activeNotes[key]) {
        this.activeNotes[key]();
        delete this.activeNotes[key];
      }
    } else if (event.name === 'Program Change') {
      this.channelPrograms[event.channel] = event.value;
    }
  }
}

export default new MidiService();
