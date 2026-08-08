import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react';

export const CameraMicPermissionModal = ({ isOpen, onClose, onPermissionGranted }) => {
  const [cameraStatus, setCameraStatus] = useState('pending'); // 'pending' | 'granted' | 'denied'
  const [micStatus, setMicStatus] = useState('pending');
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkExistingPermissions = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const cam = await navigator.permissions.query({ name: 'camera' }).catch(() => null);
        const mic = await navigator.permissions.query({ name: 'microphone' }).catch(() => null);
        if (cam?.state === 'granted') setCameraStatus('granted');
        if (mic?.state === 'granted') setMicStatus('granted');
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkExistingPermissions();
    }
  }, [isOpen]);

  const requestAccess = async () => {
    setIsRequesting(true);
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStatus('granted');
      setMicStatus('granted');
      stream.getTracks().forEach(t => t.stop());
      if (onPermissionGranted) onPermissionGranted();
      setTimeout(() => {
        setIsRequesting(false);
        if (onClose) onClose();
      }, 600);
    } catch (err) {
      setIsRequesting(false);
      setCameraStatus('denied');
      setMicStatus('denied');
      setErrorMessage('Camera or microphone access denied. Please allow permissions in your browser bar.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%', maxWidth: 420, background: '#ffffff',
            borderRadius: 16, border: '1px solid #eaeaea',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: '#fafafa', border: '1px solid #eaeaea',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#171717'
              }}>
                <Shield size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#171717', margin: 0, letterSpacing: '-0.02em' }}>
                  Device Permissions
                </h3>
                <p style={{ fontSize: 11, color: '#666666', margin: '2px 0 0' }}>
                  Camera & microphone check
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#888888', padding: 4, borderRadius: 6
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 13, color: '#444444', lineHeight: 1.5, margin: '0 0 16px' }}>
              ALGOOlympia uses video and microphone input during technical coding and spoken answer assessment modules.
            </p>

            {/* Permission Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {/* Camera Card */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10, background: '#fafafa',
                border: '1px solid #eaeaea'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Camera size={16} className="text-zinc-700" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>Webcam</span>
                </div>
                <div>
                  {cameraStatus === 'granted' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#16a34a' }}>
                      <CheckCircle2 size={13} /> Enabled
                    </span>
                  ) : cameraStatus === 'denied' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#dc2626' }}>
                      <AlertCircle size={13} /> Denied
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#888888' }}>Not Requested</span>
                  )}
                </div>
              </div>

              {/* Microphone Card */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 10, background: '#fafafa',
                border: '1px solid #eaeaea'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mic size={16} className="text-zinc-700" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>Microphone</span>
                </div>
                <div>
                  {micStatus === 'granted' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#16a34a' }}>
                      <CheckCircle2 size={13} /> Enabled
                    </span>
                  ) : micStatus === 'denied' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#dc2626' }}>
                      <AlertCircle size={13} /> Denied
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#888888' }}>Not Requested</span>
                  )}
                </div>
              </div>
            </div>

            {errorMessage && (
              <div style={{
                padding: '8px 12px', borderRadius: 8, background: '#fef2f2',
                border: '1px solid #fecaca', color: '#991b1b', fontSize: 11,
                marginBottom: 14, lineHeight: 1.4
              }}>
                {errorMessage}
              </div>
            )}

            {/* Action */}
            <button
              onClick={requestAccess}
              disabled={isRequesting}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
                background: '#171717', border: 'none', color: '#ffffff',
                fontWeight: 600, fontSize: 13, transition: 'all 0.15s'
              }}
            >
              {isRequesting ? 'Requesting Permissions…' : 'Enable Camera & Microphone'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CameraMicPermissionModal;
