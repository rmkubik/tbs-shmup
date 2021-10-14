import { h } from "preact";

const Condition = ({ condition }) => {
  switch (condition) {
    case "nebula":
      return (
        <li>
          <b>ATMO:</b> <span className="caution">Nebula cloud</span>
        </li>
      );
    case "stalling":
      return (
        <li>
          <b>ATMO:</b>
          <span className="caution">Entered Farble Gas field</span>
        </li>
      );
    case "heavyAsteroids":
      return (
        <li>
          <b>SCANNERS:</b>{" "}
          <span className="negative">Heavy density asteroids</span>
        </li>
      );
    case "mediumAsteroids":
      return (
        <li>
          <b>SCANNERS:</b>{" "}
          <span className="caution">Medium density asteroids</span>
        </li>
      );
    case "lightAsteroids":
      return (
        <li>
          <b>SCANNERS:</b>{" "}
          <span className="positive">Light density asteroids</span>
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
          <span className="negative">Left thruster offline</span>
        </li>
      );
    case "malfunctioning":
      return (
        <li>
          <b>NAVIGATION:</b>{" "}
          <span className="caution">Direction modules scrambled</span>
        </li>
      );
    default:
      console.warn(`Condition "${condition}" has no description.`);
      return null;
  }
};

export default Condition;
