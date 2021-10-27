import { h } from "preact";
import Button from "./Button";
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
        <Button onClick={onBack}>Back</Button>
      </div>
    </Modal>
  );
};

export default CreditsModal;
