let audioCtx, masterGain, padFilter;
let schedulerTimer = null;
let step = 0;
const tempo = 72;
const subdivision = 4;
const stepMs = (60 / tempo) * 1000 / subdivision;

const rootMidi = 57;
const minorScale = [0,2,3,5,7,8,10];

function midiToFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
}
function randChoice(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}
function mkReverbBuffer(ctx, seconds = 3, decay = 2.5) {
    const rate = ctx.sampleRate;
    const length = rate * seconds;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const ch = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
    }
    return impulse;
}
function mkNoiseBuffer(ctx, seconds = 1) {
    const rate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, rate * seconds, rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
}

function createAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(audioCtx.destination);

    padFilter = audioCtx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 1200;
    padFilter.Q.value = 0.7;
    padFilter.connect(masterGain);

    const convolver = audioCtx.createConvolver();
    convolver.buffer = mkReverbBuffer(audioCtx, 4.0, 2.5);
    const reverbSend = audioCtx.createGain();
    reverbSend.gain.value = 0.35;
    reverbSend.connect(convolver);
    convolver.connect(masterGain);

    const padOsc1 = audioCtx.createOscillator();
    padOsc1.type = 'sawtooth';
    padOsc1.frequency.value = midiToFreq(rootMidi - 12);

    const padOsc2 = audioCtx.createOscillator();
    padOsc2.type = 'sawtooth';
    padOsc2.frequency.value = midiToFreq(rootMidi - 12);
    padOsc2.detune.value = 7;

    const padGain = audioCtx.createGain();
    padGain.gain.value = 0.18;

    const padLFO = audioCtx.createOscillator();
    padLFO.type = 'sine';
    padLFO.frequency.value = 0.07;
    const padLFODepth = audioCtx.createGain();
    padLFODepth.gain.value = 600;

    padOsc1.connect(padGain);
    padOsc2.connect(padGain);
    padGain.connect(padFilter);

    padLFO.connect(padLFODepth);
    padLFODepth.connect(padFilter.frequency);

    padOsc1.start();
    padOsc2.start();
    padLFO.start();
}

function triggerSynthNote(freq, time, duration = 0.4, type = 'sawtooth', gain = 0.16) {
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200 + Math.random() * 900, time);
    filter.Q.value = 0.6;
    osc.connect(filter);
    filter.connect(padFilter);
    osc.start(time);
    osc.stop(time + duration + 0.05);
}

function triggerBass(freq, time, duration = 0.36) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.6, time + 0.01);
    g.gain.linearRampToValueAtTime(0.0001, time + duration);
    const bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(800, time);
    osc.connect(bassFilter);
    bassFilter.connect(masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.02);
}

const noiseBufferCache = { buf: null };
function triggerHat(time, duration = 0.06) {
    if (!noiseBufferCache.buf) noiseBufferCache.buf = mkNoiseBuffer(audioCtx, 1);
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBufferCache.buf;
    const hf = audioCtx.createBiquadFilter();
    hf.type = 'highpass';
    hf.frequency.setValueAtTime(6000, time);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.35, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    src.connect(hf);
    hf.connect(g);
    g.connect(masterGain);
    src.start(time);
    src.stop(time + duration + 0.02);
}

function triggerKick(time) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    const startFreq = 120;
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.12);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.9, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.36);
}

function startSequencer() {
    if (!audioCtx) return;
    step = 0;
    const stepsPerBar = 16;
    schedulerTimer = setInterval(() => {
        const now = audioCtx.currentTime + 0.05;
        if (step % 4 === 0) {
            const chordRoot = rootMidi + (Math.random() > 0.6 ? 0 : -12);
            const note = chordRoot + randChoice(minorScale) + (Math.random() > 0.5 ? 0 : 12);
            triggerSynthNote(midiToFreq(note), now, 0.75, 'triangle', 0.12);
        }
        if (Math.random() < 0.45) {
            const arpNote = rootMidi + randChoice(minorScale) + (Math.random() > 0.6 ? 12 : 0);
            triggerSynthNote(midiToFreq(arpNote), now, 0.12, 'sawtooth', 0.08);
        }
        if (step % 16 === 0) {
            const bassNote = rootMidi - 24 + randChoice([0, -2, 0]);
            triggerBass(midiToFreq(bassNote), now, 0.36);
        }
        if (Math.random() < 0.42) triggerHat(now, 0.05);
        if (Math.random() < 0.18 && (step % 4 === 0)) triggerKick(now);
        if (padFilter) {
            const base = 900 + Math.sin(audioCtx.currentTime * 0.15) * 350;
            padFilter.frequency.setTargetAtTime(base + Math.random() * 400, audioCtx.currentTime, 0.6);
        }
        step = (step + 1) % stepsPerBar;
    }, stepMs);
}

window.addEventListener('load', async () => {
    createAudio();
    startSequencer();
});
