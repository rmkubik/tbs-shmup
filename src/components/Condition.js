import { h } from "preact";

const Condition = ({ condition }) => {
  switch (condition) {
    case "nebula":
      return (
        <li>
          <span className="nebula">Nebula</span>
        </li>
      );
    case "stalling":
      return (
        <li>
          <span className="caution">Farble Gas Field</span>
        </li>
      );
    case "heavyAsteroids":
      return (
        <li>
          <span className="negative">Heavy</span> Asteroids
        </li>
      );
    case "mediumAsteroids":
      return (
        <li>
          <span className="caution">Medium</span> Asteroids
        </li>
      );
    case "lightAsteroids":
      return <li>Light Asteroids</li>;
    case "patternedAsteroids":
      return <li>Patterned Asteroids</li>;
    default:
      return null;
  }
};

export default Condition;
