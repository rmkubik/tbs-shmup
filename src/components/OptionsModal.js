import { h } from "preact";
import Button from "./Button";
import Modal from "./Modal";

const OptionsModal = ({
  enableVfx,
  setEnableVfx,
  skipMenuStory,
  setSkipMenuStory,
  areCheckpointsEnabled,
  setAreCheckpointsEnabled,
  volume,
  setVolume,
  playSound,
  setShouldShowSectorDetails,
  setShowStory,
  setShowOptions,
  startNewRound,
  setWinStreak,
  setShowCredits,
  setShouldShowGalaxyMap,
  setLastCheckpoint,
}) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">OPTIONS</p>
      </div>
      <div className="options-fields">
        <label htmlFor="enableVfx">
          <input
            type="checkbox"
            name="enableVfx"
            id="enableVfx"
            checked={enableVfx}
            onChange={(event) => setEnableVfx(event.target.checked)}
          />
          Enable VFX Filter
        </label>
        <label htmlFor="skipStoryIntro">
          <input
            type="checkbox"
            name="skipStoryIntro"
            id="skipStoryIntro"
            checked={skipMenuStory}
            onChange={(event) => setSkipMenuStory(event.target.checked)}
          />
          Skip Story Intro
        </label>
        <label htmlFor="disableCheckpoints">
          <input
            type="checkbox"
            name="disableCheckpoints"
            id="disableCheckpoints"
            checked={!areCheckpointsEnabled}
            // We're inverting this option for the user
            // When they say yes to disabling checkpoints, we
            // set internal state to false.
            onChange={(event) =>
              setAreCheckpointsEnabled(!event.target.checked)
            }
          />
          Disable Checkpoints
        </label>
        <label htmlFor="volume">
          Volume
          <br />
          <input
            type="range"
            name="volume"
            id="volume"
            value={volume * 100}
            min={0}
            max={100}
            onChange={(event) => {
              playSound("click");
              setVolume(event.target.value / 100);
            }}
          />
        </label>
        <Button
          onClick={() => {
            setShouldShowSectorDetails(true);
          }}
        >
          Current Sector Details
        </Button>
        <Button
          onClick={() => {
            setShouldShowGalaxyMap(true);
          }}
        >
          Galaxy Map
        </Button>
        <Button
          onClick={() => {
            setShowStory(true);
            setShowOptions(false);
            startNewRound();
          }}
        >
          Story
        </Button>
        <Button
          onClick={() => {
            setShowOptions(false);
            startNewRound(undefined, undefined, true);
          }}
        >
          Reset Progress
        </Button>
        <Button
          onClick={() => {
            setShowCredits(true);
          }}
        >
          Credits
        </Button>
      </div>
      <div className="button-container">
        <Button
          onClick={() => {
            setShowOptions(false);
          }}
        >
          Resume
        </Button>
      </div>
    </Modal>
  );
};

export default OptionsModal;
