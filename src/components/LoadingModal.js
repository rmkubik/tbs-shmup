import { h } from "preact";
import Modal from "./Modal";

const LoadingModal = () => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">LOADING</p>
      </div>
      <p>Loading save data and assets...</p>
    </Modal>
  );
};

export default LoadingModal;
