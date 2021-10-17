import { h } from "preact";
import { useState } from "preact/hooks";

import warningIcon from "../../assets/warning.png";
import shipIcon from "../../assets/ship.png";
import asteroidIcon from "../../assets/asteroid.png";
import explosionIcon from "../../assets/explosion.png";
import bulletIcon from "../../assets/bullet.png";

const ConditionImage = ({ condition, setShouldShowTooltip }) => {
  let iconSrc;

  switch (condition) {
    case "nebula":
      iconSrc = warningIcon;
      break;
    case "stalling":
      iconSrc = shipIcon;
      break;
    case "left-offline":
      iconSrc = shipIcon;
      break;
    case "malfunctioning":
      iconSrc = shipIcon;
      break;
    case "heavyAsteroids":
      iconSrc = asteroidIcon;
      break;
    case "mediumAsteroids":
      iconSrc = asteroidIcon;
      break;
    case "lightAsteroids":
      iconSrc = asteroidIcon;
      break;
    case "patternedAsteroids-slalom":
      iconSrc = asteroidIcon;
      break;
    case "patternedAsteroids-kreldfarr":
      iconSrc = asteroidIcon;
      break;
    case "patternedAsteroids-hwaranklex":
      iconSrc = asteroidIcon;
      break;
    case "patternedAsteroids-wildRoids":
      iconSrc = asteroidIcon;
      break;
    default:
      console.warn(`Condition "${condition}" has no condition icon.`);
      return null;
  }

  return (
    <img
      src={iconSrc}
      onMouseEnter={() => setShouldShowTooltip(true)}
      onMouseLeave={() => setShouldShowTooltip(false)}
    />
  );
};

const ConditionTooltip = ({ condition }) => {
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
    <li>
      <ConditionImage
        condition={condition}
        setShouldShowTooltip={setShouldShowTooltip}
      />
      {shouldShowTooltip && <ConditionTooltip condition={condition} />}
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
