import { h } from "preact";
import { useState } from "preact/hooks";

import warningIcon from "../../assets/warning.png";
import shipIcon from "../../assets/ship.png";
import asteroidIcon from "../../assets/asteroid.png";
import explosionIcon from "../../assets/explosion.png";
import bulletIcon from "../../assets/bullet.png";
import useTheme from "../hooks/useTheme";

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
  const { theme } = useTheme();

  switch (condition) {
    case "nebula":
      return (
        <span
          style={{
            color: theme.cautionColor,
            borderColor: theme.cautionColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Nebula
        </span>
      );
    case "stalling":
      return (
        <span
          style={{
            color: theme.cautionColor,
            borderColor: theme.cautionColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Engine Stalling
        </span>
      );
    case "left-offline":
      return (
        <span
          style={{
            color: theme.hazardColor,
            borderColor: theme.hazardColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Left Thruster Offline
        </span>
      );
    case "malfunctioning":
      return (
        <span
          style={{
            color: theme.cautionColor,
            borderColor: theme.cautionColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Directions Scrambled
        </span>
      );
    case "heavyAsteroids":
      return (
        <span
          style={{
            color: theme.hazardColor,
            borderColor: theme.hazardColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Heavy Asteroids
        </span>
      );
    case "mediumAsteroids":
      return (
        <span
          style={{
            color: theme.cautionColor,
            borderColor: theme.cautionColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Medium Asteroids
        </span>
      );
    case "lightAsteroids":
      return (
        <span
          style={{
            color: theme.positiveColor,
            borderColor: theme.positiveColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Light Asteroids
        </span>
      );
    case "patternedAsteroids-slalom":
      return (
        <span
          style={{
            borderColor: theme.primaryColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Slalom Patterned Asteroids
        </span>
      );
    case "patternedAsteroids-kreldfarr":
      return (
        <span
          style={{
            borderColor: theme.primaryColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Kreldfarr Patterned Asteroids
        </span>
      );
    case "patternedAsteroids-hwaranklex":
      return (
        <span
          style={{
            borderColor: theme.primaryColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Hwaranklex Patterned Asteroids
        </span>
      );
    case "patternedAsteroids-wildRoids":
      return (
        <span
          style={{
            borderColor: theme.primaryColor,
            backgroundColor: theme.backgroundColor,
          }}
        >
          Wild Patterned Asteroids
        </span>
      );
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
