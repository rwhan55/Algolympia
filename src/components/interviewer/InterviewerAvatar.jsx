import React from 'react';
import { motion } from 'framer-motion';

export const InterviewerAvatar = ({ interviewer, isSpeaking = false, size = 'lg' }) => {
  const sizes = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-32 h-32 text-5xl',
    xl: 'w-40 h-40 text-6xl',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Speaking Ripple Rings */}
      {isSpeaking && (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border-2 border-cyan-400"
            style={{ borderColor: interviewer.color }}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.6, delay: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-cyan-300"
            style={{ borderColor: interviewer.color }}
          />
        </>
      )}

      {/* Main Avatar Container */}
      <motion.div
        animate={isSpeaking ? { scale: [1, 1.04, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`relative ${sizes[size]} rounded-full flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 border-4 shadow-2xl z-10`}
        style={{ borderColor: interviewer.color }}
      >
        <span className="select-none filter drop-shadow-lg">{interviewer.avatar}</span>

        {/* Live Speaking Indicator Badge */}
        {isSpeaking && (
          <span className="absolute -bottom-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500 text-slate-950 shadow-lg tracking-wider animate-pulse">
            Speaking
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default InterviewerAvatar;
