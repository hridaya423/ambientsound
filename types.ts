export interface Sound {
    id: string;
    name: string;
    emoji: string;
    volume: number;
    isPlaying: boolean;
    category: string;
    audioUrl: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    emoji: string;
    searchTerms: string[];
  }
  
  export interface Preset {
    name: string;
    emoji: string;
    soundSettings: {
      [key: string]: {
        volume: number;
        isPlaying: boolean;
      }
    };
  }
  
  export interface FreesoundSound {
    id: number;
    name: string;
    previews: {
      'preview-hq-mp3': string;
      'preview-lq-mp3': string;
    };
    duration: number;
    license: string;
  }