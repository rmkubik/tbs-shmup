import { h } from "preact";
import Button from "./Button";
import Modal from "./Modal";

const MainMenuModal = ({ onStart }) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">ROCKET JOCKEY</p>
      </div>
      <p>Captain Pick-a-Card's Great Escape</p>

      <div className="button-container">
        <Button onClick={onStart}>Start</Button>
      </div>
    </Modal>
  );
};

export default MainMenuModal;
