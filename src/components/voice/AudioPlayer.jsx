import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

export const AudioPlayer = ({ textToSpeak, onSpeechStart, onSpeechEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Stop any ongoing speech synth on unmount or text change
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  }, [textToSpeak]);

  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (onSpeechEnd) onSpeechEnd();
      clearInterval(intervalRef.current);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsPlaying(true);
        if (onSpeechStart) onSpeechStart();
        let step = 0;
        intervalRef.current = setInterval(() => {
          step += 2;
          setProgress(Math.min(100, step));
        }, 300);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        if (onSpeechEnd) onSpeechEnd();
        clearInterval(intervalRef.current);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (onSpeechEnd) onSpeechEnd();
        clearInterval(intervalRef.current);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReplay = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => {
      handlePlayPause();
    }, 150);
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
            title={isPlaying ? 'Pause Audio' : 'Play AI Question Audio'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={handleReplay}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Replay Audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-3">
          <AudioWaveform isPlaying={isPlaying} />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
          <Volume2 className="w-4 h-4" />
          <span>AI Voice</span>
        </div>
      </div>

      {/* Audio Progress Bar */}
      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
        <div
          className="bg-cyan-400 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
