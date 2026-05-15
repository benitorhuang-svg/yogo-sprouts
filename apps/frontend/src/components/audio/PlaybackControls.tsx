import React, { FC } from 'react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  repeatMode: 'playlist' | 'single';
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleRepeat: () => void;
}

/**
 * ⏯️ PlaybackControls Component
 * 處理播放、暫停、上一首、下一首與循環模式
 */
export const PlaybackControls: FC<PlaybackControlsProps> = ({
  isPlaying,
  repeatMode,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleRepeat,
}) => {
  return (
    <>
      <button
        className="control-btn mode-btn"
        onClick={onToggleRepeat}
        title={repeatMode === 'playlist' ? '清單循環' : '單曲循環'}
      >
        {repeatMode === 'playlist' ? '🔁' : '🔂'}
      </button>
      <button className="control-btn" onClick={onPrev} title="上一首">
        ⏮️
      </button>
      <button className="play-btn" onClick={onTogglePlay} title={isPlaying ? '暫停' : '播放'}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button className="control-btn" onClick={onNext} title="下一首">
        ⏭️
      </button>
    </>
  );
};
