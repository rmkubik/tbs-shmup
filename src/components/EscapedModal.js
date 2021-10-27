import { h } from "preact";
import Button from "./Button";
import Modal from "./Modal";

const EscapedModal = ({ onMenuClick, winStreak }) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span className="positive">YOU ESCAPED</span>
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
