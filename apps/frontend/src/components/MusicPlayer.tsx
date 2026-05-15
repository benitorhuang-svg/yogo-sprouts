import React, { FC, useState, useEffect } from 'react';
import { audioManager } from '@/audioManager';
import './MusicPlayer.css';

const MusicPlayer: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [trackName, setTrackName] = useState(() => audioManager.getCurrentTrackName());
  const [repeatMode, setRepeatMode] = useState<'playlist' | 'single'>(
    () => audioManager.repeatMode
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioManager.bgm && audioManager.bgm.playing()) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      setTrackName(audioManager.getCurrentTrackName());
      setRepeatMode(audioManager.repeatMode);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioManager.bgm.pause();
    } else {
      audioManager.bgm.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    audioManager.nextTrack();
    setTrackName(audioManager.getCurrentTrackName());
    setIsPlaying(true);
  };

  const prevTrack = () => {
    audioManager.prevTrack();
    setTrackName(audioManager.getCurrentTrackName());
    setIsPlaying(true);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    if (audioManager.bgm) {
      audioManager.bgm.mute(newMuted);
    }
    setIsMuted(newMuted);
  };

  const handleToggleRepeat = () => {
    const newMode = audioManager.toggleRepeatMode();
    setRepeatMode(newMode);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioManager.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      if (audioManager.bgm) audioManager.bgm.mute(false);
      setIsMuted(false);
    }
  };

  return (
    <div className="music-player open">
      <div className="player-toggle" title="音樂播放器">
        <span className={`disc-icon ${isPlaying ? 'spinning' : ''}`}>💿</span>
      </div>
      <div className="player-controls">
        <span className="player-title" title={trackName}>
          {trackName}
        </span>
        <button
          className="control-btn mode-btn"
          onClick={handleToggleRepeat}
          title={repeatMode === 'playlist' ? '清單循環' : '單曲循環'}
        >
          {repeatMode === 'playlist' ? '🔁' : '🔂'}
        </button>
        <button className="control-btn" onClick={prevTrack} title="上一首">
          ⏮️
        </button>
        <button className="play-btn" onClick={togglePlay} title={isPlaying ? '暫停' : '播放'}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="control-btn" onClick={nextTrack} title="下一首">
          ⏭️
        </button>
        <button
          className="control-btn volume-btn"
          onClick={toggleMute}
          title={isMuted ? '取消靜音' : '靜音'}
        >
          {isMuted || volume === 0 ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          title="調整音量"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
