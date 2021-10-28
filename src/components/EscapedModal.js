import { h } from "preact";
import useTheme from "../hooks/useTheme";
import Button from "./Button";
import Modal from "./Modal";

const EscapedModal = ({ onMenuClick, winStreak }) => {
  const { theme } = useTheme();

  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span style={{ color: theme.positiveColor }}>YOU ESCAPED</span>
        </p>
        <p className="streak">All {winStreak} sectors are behind you now.</p>
      </div>
      <p>Congratulations, Captain!</p>
      <div className="button-container">
        <Button onClick={onMenuClick}>Menu</Button>
      </div>
    </Modal>
  );
};

export default EscapedModal;
