import { h } from "preact";
import { useState } from "preact/hooks";

import warningIcon from "../../assets/warning.png";
import shipIcon from "../../assets/ship.png";
import asteroidIcon1 from "../../assets/asteroid1.png";
import asteroidIcon2 from "../../assets/asteroid2.png";
import asteroidIcon3 from "../../assets/asteroid3.png";
import asteroidIcon4 from "../../assets/asteroid4.png";
import explosionIcon from "../../assets/explosion.png";
import bulletIcon from "../../assets/bullet.png";
import Sprite from "./Sprite";
import useTheme from "../hooks/useTheme";

const ConditionImage = ({ condition, setShouldShowTooltip }) => {
  let iconSrc;
  let color;

  switch (condition) {
    case "nebula":
      iconSrc = warningIcon;
      color = "cautionColor";
      break;
    case "stalling":
      iconSrc = shipIcon;
      color = "cautionColor";
      break;
    case "left-offline":
      iconSrc = shipIcon;
      color = "hazardColor";
      break;
    case "malfunctioning":
      iconSrc = shipIcon;
      color = "hazardColor";
      break;
    case "heavyAsteroids":
      iconSrc = asteroidIcon4;
      color = "hazardColor";
      break;
    case "mediumAsteroids":
      iconSrc = asteroidIcon3;
      color = "cautionColor";
      break;
    case "lightAsteroids":
      iconSrc = asteroidIcon1;
      color = "positiveColor";
      break;
    case "patternedAsteroids-slalom":
      iconSrc = asteroidIcon2;
      color = "primaryColor";
      break;
    case "patternedAsteroids-kreldfarr":
      iconSrc = asteroidIcon3;
      color = "primaryColor";
      break;
    case "patternedAsteroids-hwaranklex":
      iconSrc = asteroidIcon2;
      color = "primaryColor";
      break;
    case "patternedAsteroids-wildRoids":
      iconSrc = asteroidIcon4;
      color = "primaryColor";
      break;
    default:
      console.warn(`Condition "${condition}" has no condition icon.`);
      return null;
  }

  return (
    <Sprite
      src={iconSrc}
      color={color}
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

const SectorHeader = ({ zone, winStreak, sector }) => {
  return (
    <div className="header">
      <p>{zone.name}</p>
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
