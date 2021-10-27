import { h } from "preact";
import useTheme from "../hooks/useTheme";

const Button = ({ children, ref, ...props }) => {
  const { theme } = useTheme();

  return (
    <button
      ref={ref}
      style={{
        color: theme.primaryColor,
        borderColor: theme.primaryColor,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
