import { h } from "preact";
import Modal from "./Modal";

const MainMenuModal = ({ onStart }) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">ROCKET JOCKEY</p>
      </div>
      <p>Captain Pick-a-Card's Great Escape</p>

      <div className="button-container">
        <button onClick={onStart}>Start</button>
      </div>
    </Modal>
  );
};

export default MainMenuModal;
