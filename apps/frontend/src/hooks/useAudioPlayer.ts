import { useState, useEffect } from 'react';
import { audioManager } from '@/audioManager';

/**
 * 🎵 useAudioPlayer Hook
 * 負責將音訊播放器的內部狀態與 React 組件同步
 */
export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [trackName, setTrackName] = useState(() => audioManager.getCurrentTrackName());
  const [repeatMode, setRepeatMode] = useState<'playlist' | 'single'>(
    () => audioManager.repeatMode
  );

  // 同步音訊狀態 (Polling 模式，因為 SoundManager 暫無 Event Emitter)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(audioManager.bgm?.playing() || false);
      setTrackName(audioManager.getCurrentTrackName());
      setRepeatMode(audioManager.repeatMode);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (isPlaying) audioManager.bgm.pause();
    else audioManager.bgm.play();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    audioManager.nextTrack();
    setIsPlaying(true);
  };

  const prevTrack = () => {
    audioManager.prevTrack();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    audioManager.bgm?.mute(newMuted);
    setIsMuted(newMuted);
  };

  const toggleRepeat = () => {
    const newMode = audioManager.toggleRepeatMode();
    setRepeatMode(newMode);
  };

  const adjustVolume = (vol: number) => {
    setVolume(vol);
    audioManager.setVolume(vol);
    if (vol > 0 && isMuted) {
      audioManager.bgm?.mute(false);
      setIsMuted(false);
    }
  };

  return {
    isPlaying,
    isMuted,
    volume,
    trackName,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleMute,
    toggleRepeat,
    adjustVolume,
  };
};
