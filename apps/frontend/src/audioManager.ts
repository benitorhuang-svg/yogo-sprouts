import { Howl } from 'howler';

class SoundManager {
  public bgm!: Howl;
  public cartAdd: Howl;
  public success: Howl;
  public categorySwitch: Howl;
  private isBgmStarted: boolean = false;

  private bgmTracks: string[] = [
    '/audio/bgm-1.mp3',
    '/audio/bgm-2.mp3',
    '/audio/bgm-3.mp3',
    '/audio/bgm-4.mp3',
    '/audio/bgm-5.mp3',
    '/audio/bgm-6.mp3',
  ];
  private trackNames: string[] = [
    '🌱 晨曦晨露 - 芽菜工坊',
    '🌿 微風輕拂 - 綠意盎然',
    '☀️ 陽光灑落 - 溫室日常',
    '💧 清泉滴答 - 水耕輕音樂',
    '🌾 豐收喜悅 - 芽菜狂想曲',
    '🎵 YoGo 品牌主題曲 - 有夠菜',
  ];
  private currentTrackIndex: number = 5;
  private currentVolume: number = 0.8;
  public repeatMode: 'playlist' | 'single' = 'playlist';

  constructor() {
    this.currentTrackIndex = 5;
    this.loadBgm(this.bgmTracks[this.currentTrackIndex]);

    this.cartAdd = new Howl({
      src: ['/audio/sfx-cart-add.wav'],
      volume: 0.6,
    });

    this.success = new Howl({
      src: ['/audio/sfx-success.wav'],
      volume: 0.7,
    });

    this.categorySwitch = new Howl({
      src: ['/audio/sfx-category-switch.wav'],
      volume: 0.4,
    });
  }

  public setVolume(vol: number): void {
    this.currentVolume = vol;
    if (this.bgm) {
      this.bgm.volume(vol);
    }
  }

  public toggleRepeatMode(): 'playlist' | 'single' {
    this.repeatMode = this.repeatMode === 'playlist' ? 'single' : 'playlist';
    if (this.bgm) {
      this.bgm.loop(this.repeatMode === 'single');
    }
    return this.repeatMode;
  }

  public getCurrentTrackName(): string {
    return this.trackNames[this.currentTrackIndex];
  }

  private loadBgm(src: string, autoPlay: boolean = false) {
    if (this.bgm) {
      this.bgm.unload();
    }
    this.bgm = new Howl({
      src: [src],
      loop: this.repeatMode === 'single',
      volume: this.currentVolume,
      preload: true,
      autoplay: autoPlay,
      onend: () => {
        if (this.repeatMode === 'playlist') {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % this.bgmTracks.length;
          this.loadBgm(this.bgmTracks[this.currentTrackIndex], true);
        }
      },
      onloaderror: () => {
        console.warn('YoGo Audio: BGM file not found.');
      },
      onplayerror: () => {
        console.warn('YoGo Audio: Autoplay blocked for BGM.');
      },
    });
  }

  public nextTrack(): void {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.bgmTracks.length;
    const wasPlaying = this.bgm ? this.bgm.playing() : false;
    this.loadBgm(this.bgmTracks[this.currentTrackIndex], wasPlaying);
  }

  public prevTrack(): void {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.bgmTracks.length) % this.bgmTracks.length;
    const wasPlaying = this.bgm ? this.bgm.playing() : false;
    this.loadBgm(this.bgmTracks[this.currentTrackIndex], wasPlaying);
  }

  public initBgmAutoplay(): void {
    if (this.isBgmStarted) return;

    const startAudio = () => {
      if (!this.isBgmStarted) {
        this.bgm.play();
        this.isBgmStarted = true;
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
        window.removeEventListener('touchstart', startAudio);
      }
    };

    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('keydown', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
  }

  public playCartAdd(): void {
    this.cartAdd.play();
  }

  public playSuccess(): void {
    this.success.play();
  }

  public playCategorySwitch(): void {
    this.categorySwitch.play();
  }
}

export const audioManager = new SoundManager();
