import { h } from "preact";
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
        <button
          onClick={() => {
            setShouldShowSectorDetails(true);
          }}
        >
          Current Sector Details
        </button>
        <button
          onClick={() => {
            setShowStory(true);
            setShowOptions(false);
            startNewRound();
          }}
        >
          Story
        </button>
        <button
          onClick={() => {
            setWinStreak(0);
            setShowOptions(false);
            startNewRound();
          }}
        >
          Reset Progress
        </button>
        <button
          onClick={() => {
            setShowCredits(true);
          }}
        >
          Credits
        </button>
      </div>
      <div className="button-container">
        <button
          onClick={() => {
            setShowOptions(false);
          }}
        >
          Resume
        </button>
      </div>
    </Modal>
  );
};

export default OptionsModal;
