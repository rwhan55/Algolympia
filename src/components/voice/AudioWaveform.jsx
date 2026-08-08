import React from 'react';
import { motion } from 'framer-motion';

export const AudioWaveform = ({ isPlaying = false, levels = null }) => {
  const defaultBars = [40, 70, 30, 90, 50, 80, 40, 60, 100, 40, 70, 50];
  const barHeights = levels || defaultBars;

  return (
    <div className="flex items-center justify-center gap-1 h-8 w-full px-2">
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${isPlaying ? 'bg-cyan-400' : 'bg-slate-700'}`}
          animate={
            isPlaying
              ? {
                  height: [`${Math.max(15, height * 0.3)}%`, `${Math.min(100, height)}%`, `${Math.max(15, height * 0.2)}%`],
                }
              : { height: '20%' }
          }
          transition={
            isPlaying
              ? {
                  repeat: Infinity,
                  duration: 0.6 + (i % 4) * 0.15,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
