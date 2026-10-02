// Pure client-side Web Audio ambient sound synthesizer for rain & gentle Baltic breeze
class AmbientAudioController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private windOsc: OscillatorNode | null = null;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // Generate 2 seconds of pink/brown noise buffer for gentle rain & mist
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.08;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Lowpass filter to simulate gentle rain patter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, this.ctx.currentTime);

      this.noiseNode.connect(filter);
      filter.connect(this.masterGain);
      this.noiseNode.start();

      // Soft wind swell oscillator
      this.windOsc = this.ctx.createOscillator();
      this.windOsc.type = 'sine';
      this.windOsc.frequency.setValueAtTime(110, this.ctx.currentTime);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.windOsc.connect(windGain);
      windGain.connect(this.masterGain);
      this.windOsc.start();

      this.isPlaying = true;
    } catch (e) {
      console.warn('Web Audio ambient sound init error:', e);
      this.isPlaying = false;
    }
  }

  public stop() {
    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        setTimeout(() => {
          this.noiseNode?.stop();
          this.windOsc?.stop();
          this.ctx?.close();
          this.ctx = null;
        }, 700);
      }
    } catch {
      // ignore
    }
    this.isPlaying = false;
  }
}

export const ambientSound = new AmbientAudioController();
