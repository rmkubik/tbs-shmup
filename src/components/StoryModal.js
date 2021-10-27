import { h } from "preact";
import Button from "./Button";
import Modal from "./Modal";

const StoryModal = ({ onPlay }) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">THE STORY SO FAR</p>
      </div>
      <p>
        Your planet is dying. You're sprinting frantically to the long abandoned
        HEW rocket hangar, praying there's still one more ship.
      </p>
      <p>
        You burst through the doors and fluorescent lighting crackles into
        existence. Across the hangar, you see a derelict Mark ATT vessel.
      </p>
      <p>
        You sprint onto the ship. He's seen better days, but he'll have to do.
        Your only chance now is to get out of this system, one sector at a time.
      </p>
      <p>You gun the engine and fly off into the stars.</p>
      <p>Good luck, Captain.</p>
      <div className="button-container">
        <Button onClick={onPlay}>Play</Button>
      </div>
    </Modal>
  );
};

export default StoryModal;
