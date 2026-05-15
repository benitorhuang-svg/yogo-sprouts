import React, { FC } from 'react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
}

/**
 * 🔊 VolumeControl Component
 * 處理靜態切換與音量滑桿
 */
export const VolumeControl: FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
}) => {
  return (
    <>
      <button
        className="control-btn volume-btn"
        onClick={onToggleMute}
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
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="volume-slider"
        title="調整音量"
      />
    </>
  );
};
