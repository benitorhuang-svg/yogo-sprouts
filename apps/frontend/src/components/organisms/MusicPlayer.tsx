import { FC } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { PlaybackControls } from '../audio/PlaybackControls';
import { VolumeControl } from '../audio/VolumeControl';
import '../MusicPlayer.css';

/**
 * 🏛️ MusicPlayer (Switcher / 總指揮)
 * 負責音樂播放器的佈局外框與子組件調度
 */
const MusicPlayer: FC = () => {
  const {
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
  } = useAudioPlayer();

  return (
    <div className="music-player open">
      <div className="player-toggle" title="音樂播放器">
        <span className={`disc-icon ${isPlaying ? 'spinning' : ''}`}>💿</span>
      </div>

      <div className="player-controls">
        <span className="player-title" title={trackName}>
          {trackName}
        </span>

        <PlaybackControls
          isPlaying={isPlaying}
          repeatMode={repeatMode}
          onTogglePlay={togglePlay}
          onNext={nextTrack}
          onPrev={prevTrack}
          onToggleRepeat={toggleRepeat}
        />

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onVolumeChange={adjustVolume}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
