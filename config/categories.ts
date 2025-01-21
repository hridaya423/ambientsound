import { Category, Preset } from '../types';

export const CATEGORIES: Category[] = [
    {
      id: 'nature',
      name: 'Nature',
      emoji: '🌿',
      searchTerms: ['forest ambience', 'gentle stream', 'peaceful river', 'rustling leaves', 'soft wind trees']
    },
    {
      id: 'weather',
      name: 'Weather',
      emoji: '🌦️',
      searchTerms: ['gentle rain', 'distant thunder', 'light storm', 'soft wind', 'light drizzle']
    },
    {
      id: 'urban',
      name: 'Urban',
      emoji: '🌆',
      searchTerms: ['cafe ambience', 'coffee shop crowd', 'quiet street', 'distant traffic', 'subway station']
    },
    {
      id: 'animals',
      name: 'Animals',
      emoji: '🦊',
      searchTerms: ['songbirds', 'night crickets', 'owl hoots', 'pond frogs', 'distant wolves']
    },
    {
      id: 'ambient',
      name: 'Ambient',
      emoji: '🎵',
      searchTerms: ['white noise', 'pink noise', 'brown noise', 'ocean waves', 'ambient drone']
    },
  ];

  export const PRESETS: Preset[] = [
    {
      name: 'Rainy Forest',
      emoji: '🌧️',
      soundSettings: {
        'gentle rain': { volume: 70, isPlaying: true },
        'forest ambience': { volume: 50, isPlaying: true },
        'distant thunder': { volume: 30, isPlaying: true },
        'soft wind trees': { volume: 40, isPlaying: true }
      }
    },
    {
      name: 'Peaceful Night',
      emoji: '🌙',
      soundSettings: {
        'night crickets': { volume: 60, isPlaying: true },
        'owl hoots': { volume: 30, isPlaying: true },
        'soft wind': { volume: 20, isPlaying: true },
        'distant wolves': { volume: 15, isPlaying: true }
      }
    },
    {
      name: 'Urban Café',
      emoji: '☕',
      soundSettings: {
        'cafe ambience': { volume: 60, isPlaying: true },
        'light drizzle': { volume: 30, isPlaying: true },
        'distant traffic': { volume: 20, isPlaying: true }
      }
    },
    {
      name: 'Ocean Meditation',
      emoji: '🌊',
      soundSettings: {
        'ocean waves': { volume: 70, isPlaying: true },
        'soft wind': { volume: 30, isPlaying: true },
        'white noise': { volume: 20, isPlaying: true }
      }
    },
    {
      name: 'Forest Stream',
      emoji: '💧',
      soundSettings: {
        'gentle stream': { volume: 65, isPlaying: true },
        'forest ambience': { volume: 45, isPlaying: true },
        'songbirds': { volume: 35, isPlaying: true },
        'rustling leaves': { volume: 30, isPlaying: true }
      }
    },
    {
      name: 'Cozy Evening',
      emoji: '🏡',
      soundSettings: {
        'light rain': { volume: 45, isPlaying: true },
        'brown noise': { volume: 30, isPlaying: true },
        'distant thunder': { volume: 20, isPlaying: true }
      }
    }
  ];