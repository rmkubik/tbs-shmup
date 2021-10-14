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
    case "patternedAsteroids":
      return (
        <li>
          <b>SCANNERS:</b> Slalom asteroid field
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
      return null;
  }
};

export default Condition;
