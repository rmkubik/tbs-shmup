import { Howl, Howler } from "howler";
import { useEffect, useRef, useState } from "preact/hooks";

const useAudio = (soundFiles = []) => {
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const sounds = useRef({});

  const playSound = (key, { loop = false }) => {
    sounds.current[key].loop(loop);
    sounds.current[key].play();
  };

  const stopSound = (key) => {
    sounds.current[key].stop();
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

  return { isAudioLoaded, playSound, stopSound };
};

export default useAudio;

// h: stall
// g: 6
// d: 0

// trigger shuffle on re draw

// h: stall 2
// g: 0
// d: 3 stall

// play 2 not stall cards

// h: stall
// g: 2
// d: 3 stall

// draw 2 not stall cards

// h: stall 2
// g: 2
// d: 1 stall

// recycle not stall card, draw not stall card

// h: stall 2
// g: 3
// d: stall

// play 2 not stall cards

// h: stall
// g: 5
// d: stall

// draw last card, stall

// h: stall stall
// g: 5
// d: 0

// deck empty, trigger reshuffle

// h: stall stall
// g: 0
// d: stall 4

// draw stall to fill hand

// h: stall stall stall
// g: 0
// d: 4
