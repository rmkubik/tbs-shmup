import { h } from "preact";
import useTheme from "../hooks/useTheme";

const Modal = ({ children, containerStyles }) => {
  const { theme } = useTheme();

  return (
    <div className="modal">
      <div
        style={{
          borderColor: theme.primaryColor,
          backgroundColor: theme.backgroundColor,
          ...containerStyles,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
