import { h } from "preact";
import { useState } from "preact/hooks";

import warningIcon from "../../assets/warning.png";
import shipIcon from "../../assets/ship.png";
import asteroidIcon from "../../assets/asteroid.png";
import explosionIcon from "../../assets/explosion.png";
import bulletIcon from "../../assets/bullet.png";

const renderConditionIcon = (condition) => {
  switch (condition) {
    case "nebula":
      return <img src={warningIcon} />;
    case "stalling":
      return <img src={shipIcon} />;
    case "left-offline":
      return <img src={shipIcon} />;
    case "malfunctioning":
      return <img src={shipIcon} />;
    case "heavyAsteroids":
      return <img src={asteroidIcon} />;
    case "mediumAsteroids":
      return <img src={asteroidIcon} />;
    case "lightAsteroids":
      return <img src={asteroidIcon} />;
    case "patternedAsteroids-slalom":
      return <img src={asteroidIcon} />;
    case "patternedAsteroids-kreldfarr":
      return <img src={asteroidIcon} />;
    case "patternedAsteroids-hwaranklex":
      return <img src={asteroidIcon} />;
    case "patternedAsteroids-wildRoids":
      return <img src={asteroidIcon} />;
    default:
      console.warn(`Condition "${condition}" has no condition icon.`);
      return null;
  }
};

const renderConditionTooltip = (condition) => {
  switch (condition) {
    case "mediumAsteroids":
      return <span className="caution">Medium Asteroids</span>;
  }
  switch (condition) {
    case "nebula":
      return <span className="nebula">Nebula</span>;
    case "stalling":
      return <span className="caution">Engine Stalling</span>;
    case "left-offline":
      return <span className="negative">Left Thruster Offline</span>;
    case "malfunctioning":
      return <span className="caution">Directions Scrambled</span>;
    case "heavyAsteroids":
      return <span className="negative">Heavy Asteroids</span>;
    case "mediumAsteroids":
      return <span className="caution">Medium Asteroids</span>;
    case "lightAsteroids":
      return <span className="positive">Light Asteroids</span>;
    case "patternedAsteroids-slalom":
      return <span>Slalom Patterned Asteroids</span>;
    case "patternedAsteroids-kreldfarr":
      return <span>Kreldfarr Patterned Asteroids</span>;
    case "patternedAsteroids-hwaranklex":
      return <span>Hwaranklex Patterned Asteroids</span>;
    case "patternedAsteroids-wildRoids":
      return <span>Wild Patterned Asteroids</span>;
    default:
      console.warn(`Condition "${condition}" has no condition tooltip.`);
      return null;
  }
};

const ConditionIcon = ({ condition }) => {
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);

  return (
    <li
      onMouseEnter={() => setShouldShowTooltip(true)}
      onMouseLeave={() => setShouldShowTooltip(false)}
    >
      {renderConditionIcon(condition)}
      {shouldShowTooltip && renderConditionTooltip(condition)}
    </li>
  );
};

const SectorHeader = ({ winStreak, sector }) => {
  return (
    <div className="header">
      <p className="streak">Sector: {winStreak + 1}</p>
      <ul className="sector-conditions">
        {sector.conditions
          .filter((condition) => condition !== "checkpoint")
          .map((condition) => (
            <ConditionIcon condition={condition} />
          ))}
      </ul>
    </div>
  );
};

export default SectorHeader;
