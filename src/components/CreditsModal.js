import { h } from "preact";
import Modal from "./Modal";

const CreditsModal = ({ onBack }) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">CREDITS</p>
      </div>
      <p>Ryan Kubik</p>
      <p>Brendan McCracken</p>
      <p>Mickey Sanchez</p>
      <p>Cpt. Pick-a-Card</p>
      <p>Prof. Flargle</p>
      <div className="button-container">
        <button onClick={onBack}>Back</button>
      </div>
    </Modal>
  );
};

export default CreditsModal;
