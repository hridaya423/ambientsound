
import FreeSound from 'freesound-client';

const freesound = new FreeSound();
freesound.setToken(process.env.NEXT_PUBLIC_FREESOUND_API_KEY!);

export const searchSounds = async (query: string) => {
  try {
    const results = await freesound.textSearch(query, {
      fields: 'id,name,previews,duration,license,tags',
      filter: 'duration:[1 TO 30] license:"Creative Commons 0"',
      sort: 'rating_desc'
    });

    const filteredResults = results.results.find(sound => {
      const tags = sound.tags.map(tag => tag.toLowerCase());
      const unwantedTags = ['war', 'explosion', 'gunshot', 'helicopter', 'military', 'machine gun', 'violent'];
      return !unwantedTags.some(tag => tags.includes(tag));
    });

    return filteredResults || null;
  } catch (error) {
    console.error('Error searching sounds:', error);
    return null;
  }
};

export const loadSoundsByCategory = async (category: string, searchTerms: string[]) => {
  const sounds = [];
  
  for (const term of searchTerms) {
    const sound = await searchSounds(term);
    if (sound) {
      sounds.push({
        id: `${term}-${sound.id}`,
        name: term.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        emoji: getEmojiForSound(term),
        volume: 50,
        isPlaying: false,
        category: category,
        audioUrl: sound.previews['preview-hq-mp3']
      });
    }
  }
  
  return sounds;
};


const EMOJI_MAP: { [key: string]: string } = {
  'forest': '🌳',
  'stream': '💧',
  'river': '🌊',
  'leaves': '🍃',
  'wind in trees': '🌲',
  'rain': '🌧️',
  'thunder': '⛈️',
  'storm': '🌩️',
  'wind': '💨',
  'drizzle': '🌦️',
  'cafe': '☕',
  'coffee shop': '🏬',
  'city ambience': '🌆',
  'traffic': '🚗',
  'subway': '🚇',
  'birds': '🐦',
  'crickets': '🦗',
  'owls': '🦉',
  'frogs': '🐸',
  'wolves': '🐺',
  'white noise': '📻',
  'pink noise': '🎵',
  'brown noise': '🔊',
  'waves': '🌊',
  'drone': '🎼'
};

const getEmojiForSound = (sound: string): string => {
  return EMOJI_MAP[sound] || '🔊';
};