import { h } from "preact";
import useTheme from "../hooks/useTheme";

const Condition = ({ condition }) => {
  const { theme } = useTheme();

  switch (condition) {
    case "nebula":
      return (
        <li>
          <b>ATMO:</b>{" "}
          <span style={{ color: theme.cautionColor }}>Nebula cloud</span>
        </li>
      );
    case "stalling":
      return (
        <li>
          <b>ATMO:</b>
          <span style={{ color: theme.cautionColor }}>
            Entered Farble Gas field
          </span>
        </li>
      );
    case "heavyAsteroids":
      return (
        <li>
          <b>SCANNERS:</b>{" "}
          <span style={{ color: theme.hazardColor }}>
            Heavy density asteroids
          </span>
        </li>
      );
    case "mediumAsteroids":
      return (
        <li>
          <b>SCANNERS:</b>{" "}
          <span style={{ color: theme.cautionColor }}>
            Medium density asteroids
          </span>
        </li>
      );
    case "lightAsteroids":
      return (
        <li>
          <b>SCANNERS:</b>{" "}
          <span style={{ color: theme.positiveColor }}>
            Light density asteroids
          </span>
        </li>
      );
    case "patternedAsteroids-slalom":
      return (
        <li>
          <b>SCANNERS:</b> Slalom asteroid field
        </li>
      );
    case "patternedAsteroids-kreldfarr":
      return (
        <li>
          <b>SCANNERS:</b> Kreldfarr asteroid wall
        </li>
      );
    case "patternedAsteroids-hwaranklex":
      return (
        <li>
          <b>SCANNERS:</b> Hwaranklex asteroid formation
        </li>
      );
    case "patternedAsteroids-wildRoids":
      return (
        <li>
          <b>SCANNERS:</b> Wild asteroid oscillation
        </li>
      );
    case "left-offline":
      return (
        <li>
          <b>NAVIGATION:</b>{" "}
          <span style={{ color: theme.hazardColor }}>
            Left thruster offline
          </span>
        </li>
      );
    case "malfunctioning":
      return (
        <li>
          <b>NAVIGATION:</b>{" "}
          <span style={{ color: theme.cautionColor }}>
            Direction modules scrambled
          </span>
        </li>
      );
    default:
      console.warn(`Condition "${condition}" has no description.`);
      return null;
  }
};

export default Condition;
