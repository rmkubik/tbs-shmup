import { h } from "preact";

const Modal = ({ children }) => {
  return (
    <div className="modal">
      <div>{children}</div>
    </div>
  );
};

export default Modal;
