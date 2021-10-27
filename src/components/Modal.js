import { h } from "preact";
import useTheme from "../hooks/useTheme";

const Modal = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="modal">
      <div
        style={{
          borderColor: theme.primaryColor,
          backgroundColor: theme.backgroundColor,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
