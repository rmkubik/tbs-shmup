import { h } from "preact";
import Modal from "./Modal";
import Checkpoints from "./Checkpoints";
import SectorConditions from "./SectorConditions";
import Button from "./Button";
import useTheme from "../hooks/useTheme";

const AnotherSectorComingUpModal = ({
  winStreak,
  areCheckpointsEnabled,
  lastCheckpoint,
  sectors,
  onContinue,
}) => {
  const { theme } = useTheme();

  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span style={{ color: theme.positiveColor }}>VICTORY</span>
        </p>

        <p className="streak">Sector: {winStreak + 1}</p>

        {areCheckpointsEnabled && (
          <Checkpoints
            lastCheckpoint={lastCheckpoint}
            sectors={sectors}
            winStreak={winStreak}
          />
        )}
      </div>

      <SectorConditions
        title="Next Sector Conditions"
        sector={sectors[winStreak]}
      />
      <div className="button-container">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </Modal>
  );
};

const ZoneCompleteModal = ({ onReturnToGalaxyMap }) => {
  const { theme } = useTheme();

  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span style={{ color: theme.positiveColor }}>VICTORY</span>
        </p>
      </div>

      <p>Good work, Cpt. Deckard. I always knew you could do it. ;-)</p>

      <div className="button-container">
        <Button onClick={onReturnToGalaxyMap}>Return to Galaxy Map</Button>
      </div>
    </Modal>
  );
};

const VictoryModal = ({
  onContinue,
  winStreak,
  areCheckpointsEnabled,
  lastCheckpoint,
  sectors,
  onReturnToGalaxyMap,
}) => {
  // We've reached the end of the sectors array.
  const isZoneComplete = sectors[winStreak] === undefined;

  if (isZoneComplete) {
    return <ZoneCompleteModal onReturnToGalaxyMap={onReturnToGalaxyMap} />;
  }

  return (
    <AnotherSectorComingUpModal
      onContinue={onContinue}
      winStreak={winStreak}
      areCheckpointsEnabled={areCheckpointsEnabled}
      lastCheckpoint={lastCheckpoint}
      sectors={sectors}
    />
  );
};

export default VictoryModal;
