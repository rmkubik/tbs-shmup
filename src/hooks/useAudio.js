import { Howl, Howler } from "howler";
import { useEffect, useRef, useState } from "preact/hooks";

const useAudio = (soundFiles = []) => {
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [volume, setVolumeInternal] = useState(0.5);
  const sounds = useRef({});

  const playSound = (key, { loop = false } = {}) => {
    if (sounds.current[key].playing()) {
      // Don't play again if we're already playing
      return;
    }

    sounds.current[key].loop(loop);
    sounds.current[key].play();
  };

  const stopSound = (key) => {
    sounds.current[key].stop();
  };

  const setVolume = (volume) => {
    setVolumeInternal(volume);
    Howler.volume(volume);
  };

  useEffect(() => {
    const newSounds = soundFiles.reduce((soundsAccumulator, soundFile) => {
      const finalSeparatorIndex = soundFile.lastIndexOf("/");

      const baseName = soundFile.substring(finalSeparatorIndex + 1);
      const [soundKey] = baseName.split(".");

      return {
        ...soundsAccumulator,
        [soundKey]: new Howl({
          src: [soundFile],
          onload: () => {
            if (
              Object.values(sounds.current).every(
                (sound) => sound.state() === "loaded"
              )
            ) {
              setIsAudioLoaded(true);
            }
          },
        }),
      };
    }, {});

    sounds.current = newSounds;
  }, []);

  return { isAudioLoaded, playSound, stopSound, volume, setVolume };
};

export default useAudio;
