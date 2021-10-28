import { h } from "preact";
import useTheme from "../hooks/useTheme";

const Status = ({ status }) => {
  const { theme } = useTheme();

  switch (status) {
    case "offline":
      return (
        <span className="status" style={{ color: theme.hazardColor }}>
          OFFLINE
        </span>
      );
    case "stalling":
      return (
        <span className="status" style={{ color: theme.cautionColor }}>
          STALLING
        </span>
      );
    case "left-offline":
      return (
        <span className="status" style={{ color: theme.hazardColor }}>
          LEFT THRUSTER OFFLINE
        </span>
      );
    case "malfunctioning":
      return (
        <span className="status" style={{ color: theme.cautionColor }}>
          MALFUNCTIONING
        </span>
      );
    default:
      return (
        <span className="status" style={{ color: theme.positiveColor }}>
          ONLINE
        </span>
      );
  }
};

export default Status;
