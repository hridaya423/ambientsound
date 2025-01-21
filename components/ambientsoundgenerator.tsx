'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, VolumeX, Shuffle, Loader2, Waves, Moon, Sun } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Sound, Preset } from '../types';
import { CATEGORIES, PRESETS } from '../config/categories';
import { loadSoundsByCategory } from '../lib/freesound';

const AmbientSoundGenerator = () => {
  const [mounted, setMounted] = useState(false);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [masterVolume, setMasterVolume] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const { toast } = useToast();
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;

    const initializeAudio = () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.volume = masterVolume / 100;
        }
      });
    };

    initializeAudio();
  }, [mounted, masterVolume]);
  useEffect(() => {
    if (!mounted) return;
    loadSoundsForCategory(activeCategory);
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [activeCategory, mounted]);

  const loadSoundsForCategory = async (categoryId: string) => {
    if (!mounted) return;
    setLoading(true);
    try {
      const category = CATEGORIES.find(c => c.id === categoryId);
      if (category) {
        const newSounds = await loadSoundsByCategory(categoryId, category.searchTerms);
        setSounds(prevSounds => {
          prevSounds.forEach(sound => {
            if (audioRefs.current[sound.id]) {
              audioRefs.current[sound.id].pause();
              audioRefs.current[sound.id].src = '';
              delete audioRefs.current[sound.id];
            }
          });
          
          newSounds.forEach(sound => {
            const audio = new Audio(sound.audioUrl);
            audio.loop = true;
            audio.volume = (sound.volume * masterVolume) / 10000;
            audioRefs.current[sound.id] = audio;
          });
          
          return newSounds;
        });
      }
    } catch (error) {
      console.error('Error loading sounds:', error);
      toast({
        title: "Error",
        description: "Failed to load sounds. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSound = async (soundId: string) => {
    setSounds(prevSounds => {
      return prevSounds.map(sound => {
        if (sound.id === soundId) {
          const audio = audioRefs.current[sound.id];
          if (!sound.isPlaying) {
            audio.volume = (sound.volume * masterVolume) / 10000;
            audio.play().catch(error => {
              console.error('Playback error:', error);
              toast({
                title: "Playback Error",
                description: `Failed to play ${sound.name}. Please try again.`,
                variant: "destructive"
              });
            });
          } else {
            audio.pause();
          }
          return { ...sound, isPlaying: !sound.isPlaying };
        }
        return sound;
      });
    });
  };

  const adjustVolume = (soundId: string, newVolume: number) => {
    setSounds(prevSounds => {
      return prevSounds.map(sound => {
        if (sound.id === soundId) {
          const audio = audioRefs.current[sound.id];
          if (audio) {
            const adjustedVolume = (newVolume * masterVolume) / 10000;
            audio.volume = adjustedVolume;
            return { ...sound, volume: newVolume };
          }
        }
        return sound;
      });
    });
  };

  const adjustMasterVolume = (newVolume: number) => {
    setMasterVolume(newVolume);
    sounds.forEach(sound => {
      const audio = audioRefs.current[sound.id];
      if (audio) {
        const adjustedVolume = (sound.volume * newVolume) / 10000;
        audio.volume = adjustedVolume;
      }
    });
  };

  const applyPreset = (preset: Preset) => {
    stopAll();
    
    setSounds(prevSounds => {
      return prevSounds.map(sound => {
        const presetSetting = preset.soundSettings[sound.name.toLowerCase()];
        const audio = audioRefs.current[sound.id];
        
        if (presetSetting && audio) {
          const adjustedVolume = (presetSetting.volume * masterVolume) / 10000;
          audio.volume = adjustedVolume;
          
          if (presetSetting.isPlaying) {
            audio.play().catch(error => {
              console.error('Preset playback error:', error);
            });
          }
          
          return {
            ...sound,
            isPlaying: presetSetting.isPlaying,
            volume: presetSetting.volume
          };
        }
        
        if (audio) {
          audio.pause();
        }
        return { ...sound, isPlaying: false };
      });
    });
  };

  const stopAll = () => {
    setSounds(prevSounds => {
      prevSounds.forEach(sound => {
        const audio = audioRefs.current[sound.id];
        if (audio) {
          audio.pause();
        }
      });
      return prevSounds.map(sound => ({ ...sound, isPlaying: false }));
    });
  };

  const randomize = () => {
    stopAll();
    setSounds(prevSounds => {
      return prevSounds.map(sound => {
        const shouldPlay = Math.random() > 0.7;
        const randomVolume = Math.floor(Math.random() * 100);
        const audio = audioRefs.current[sound.id];
        
        if (shouldPlay && audio) {
          const adjustedVolume = (randomVolume * masterVolume) / 10000;
          audio.volume = adjustedVolume;
          audio.play().catch(console.error);
        }
        
        return {
          ...sound,
          isPlaying: shouldPlay,
          volume: randomVolume
        };
      });
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-rose-50'}`}>
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-12 relative">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Ambient Sound Generator
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Create your perfect ambient atmosphere
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-black" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
            onClick={randomize}
          >
            <Shuffle className="h-5 w-5 text-black" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
            onClick={stopAll}
          >
            <VolumeX className="h-5 w-5 text-black" />
          </Button>
        </div>
      </div>
      <Card className={`mb-12 backdrop-blur-md ${isDarkMode ? 'bg-white/10' : 'bg-white/70'} border-none shadow-xl`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Waves className="h-8 w-8" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Master Volume</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Control the overall sound level
              </p>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {masterVolume}%
            </span>
          </div>
          <Slider
            value={[masterVolume]}
            onValueChange={([value]) => adjustMasterVolume(value)}
            max={100}
            step={1}
            className="w-full"
          />
        </CardContent>
      </Card>
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Presets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESETS.map(preset => (
            <Button
              key={preset.name}
              variant="outline"
              className={`h-auto py-6 rounded-xl hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/70 hover:bg-white/90'
              } backdrop-blur-md border-none shadow-lg`}
              onClick={() => applyPreset(preset)}
            >
              <span className="text-3xl mr-3">{preset.emoji}</span>
              <span className="text-xl font-medium">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start mb-8 p-1 bg-transparent">
          {CATEGORIES.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className={`rounded-full transition-all duration-300 ${
                isDarkMode ? 'data-[state=active]:bg-white/20' : 'data-[state=active]:bg-white'
              }`}
            >
              <span className="text-xl mr-2">{category.emoji}</span>
              <span className="font-medium">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sounds
                  .filter(sound => sound.category === category.id)
                  .map(sound => (
                    <Card key={sound.id} className={`transform hover:scale-102 transition-all duration-300 ${
                      isDarkMode ? 'bg-white/10' : 'bg-white/70'
                    } backdrop-blur-md border-none shadow-lg`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{sound.emoji}</span>
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{sound.name}</h3>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Adjust volume or toggle sound
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => toggleSound(sound.id)}
                            variant={sound.isPlaying ? "default" : "outline"}
                            size="icon"
                            className={`rounded-full hover:scale-110 transition-transform ${
                              sound.isPlaying ? 'bg-purple-600 hover:bg-purple-700' : ''
                            }`}
                          >
                            {sound.isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[sound.volume]}
                            onValueChange={([value]) => adjustVolume(sound.id, value)}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <span className="text-lg font-semibold w-16 text-right bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            {sound.volume}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  </div>
  );
};

export default AmbientSoundGenerator;