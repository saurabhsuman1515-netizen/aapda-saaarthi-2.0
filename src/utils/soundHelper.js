/**
 * Web Audio API synthesizer for emergency siren sound
 * Works 100% offline without external mp3 audio files.
 */

let audioCtx = null;
let oscillator1 = null;
let oscillator2 = null;
let gainNode = null;
let sirenInterval = null;
let isPlaying = false;

export function toggleEmergencySiren(onStateChange) {
  if (isPlaying) {
    stopEmergencySiren();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startEmergencySiren();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function startEmergencySiren() {
  try {
    if (isPlaying) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime); // Safe volume level
    gainNode.connect(audioCtx.destination);

    oscillator1 = audioCtx.createOscillator();
    oscillator1.type = "sawtooth";
    oscillator1.frequency.setValueAtTime(650, audioCtx.currentTime);
    oscillator1.connect(gainNode);
    oscillator1.start();

    let high = false;
    sirenInterval = setInterval(() => {
      if (!audioCtx || audioCtx.state === 'closed') return;
      const targetFreq = high ? 950 : 650;
      oscillator1.frequency.linearRampToValueAtTime(targetFreq, audioCtx.currentTime + 0.35);
      high = !high;
    }, 450);

    isPlaying = true;
  } catch (err) {
    console.error("Audio API error:", err);
  }
}

export function stopEmergencySiren() {
  try {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (oscillator1) {
      oscillator1.stop();
      oscillator1.disconnect();
      oscillator1 = null;
    }
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    isPlaying = false;
  } catch (err) {
    console.error("Audio stop error:", err);
    isPlaying = false;
  }
}

export function speakText(text, lang = "en-US") {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("TTS error:", e);
  }
}
