import React from 'react';
import { Mic, Square, Pause, Play, RotateCcw, Send, Trash2 } from 'lucide-react';
import useVoiceRecorder from '../../hooks/useVoiceRecorder';
import AudioWaveform from './AudioWaveform';
import Button from '../common/Button';

export const VoiceRecorder = ({ onAnswerSubmit, isSubmitting = false }) => {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    audioLevels,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (audioBlob || recordingTime > 0) {
      onAnswerSubmit(audioBlob, recordingTime);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl glass-card border border-slate-700/60">
      {/* Header & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isRecording ? (isPaused ? 'bg-amber-400' : 'bg-rose-500 animate-ping') : 'bg-slate-600'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isRecording ? (isPaused ? 'Recording Paused' : 'Microphone Recording Active') : audioUrl ? 'Recording Captured' : 'Ready to Answer'}
          </span>
        </div>
        <div className="font-mono text-sm font-bold text-cyan-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
          {formatTime(recordingTime)}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
        <AudioWaveform isPlaying={isRecording && !isPaused} levels={audioLevels} />
      </div>

      {/* Audio Preview if Recorded */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
          <span className="text-xs font-medium text-cyan-300">Audio Preview Ready</span>
          <audio controls src={audioUrl} className="h-8 max-w-[240px]" />
        </div>
      )}

      {/* Recording Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {!isRecording && !audioUrl && (
          <Button variant="primary" size="lg" icon={Mic} onClick={startRecording} className="w-full sm:w-auto">
            Start Voice Answer
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isPaused ? (
              <Button variant="secondary" icon={Play} onClick={resumeRecording}>
                Resume
              </Button>
            ) : (
              <Button variant="secondary" icon={Pause} onClick={pauseRecording}>
                Pause
              </Button>
            )}
            <Button variant="danger" icon={Square} onClick={stopRecording}>
              Stop Recording
            </Button>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={Trash2} onClick={resetRecording} className="text-rose-400 hover:text-rose-300">
              Discard
            </Button>
            <Button variant="secondary" icon={RotateCcw} onClick={() => { resetRecording(); startRecording(); }}>
              Re-record
            </Button>
          </div>
        )}

        {/* Submit Answer Button */}
        {(audioUrl || (isRecording && recordingTime > 2)) && (
          <Button
            variant="primary"
            size="lg"
            icon={Send}
            isLoading={isSubmitting}
            onClick={() => {
              if (isRecording) stopRecording();
              handleSubmit();
            }}
            className="ml-auto w-full sm:w-auto"
          >
            Submit Answer for AI Evaluation
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
