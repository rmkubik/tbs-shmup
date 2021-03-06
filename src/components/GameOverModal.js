import { h } from "preact";
import Modal from "./Modal";
import Checkpoints from "./Checkpoints";
import SectorConditions from "./SectorConditions";
import Button from "./Button";
import useTheme from "../hooks/useTheme";

const GameOverModal = ({
  onRestart,
  winStreak,
  areCheckpointsEnabled,
  lastCheckpoint,
  sectors,
}) => {
  const { theme } = useTheme();

  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span style={{ color: theme.hazardColor }}>GAME OVER</span>
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
        title="Current Sector Conditions"
        sector={sectors[winStreak]}
      />
      {/* <SystemsList sector={sectors[winStreak]} /> */}
      <div className="button-container">
        <Button onClick={onRestart}>Restart</Button>
      </div>
    </Modal>
  );
};

export default GameOverModal;
