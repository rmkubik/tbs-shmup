import { h } from "preact";

import cogIcon from "../../assets/cog.png";
import useTheme from "../hooks/useTheme";
import Button from "./Button";
import Sprite from "./Sprite";

const Bar = ({
  power,
  maxPower,
  hand,
  selectedCard,
  setSelectedCard,
  hasUsedShipPower,
  onEndClick,
  onRecycleClick,
  setShowOptions,
}) => {
  const { theme } = useTheme();

  return (
    <div className="bar">
      <div>
        <p>
          PWR: {power}/{maxPower}
        </p>
        <Button disabled={hasUsedShipPower} onClick={onRecycleClick}>
          {hasUsedShipPower ? "Recharging..." : "Recycle"}
        </Button>
        {/* <Button onClick={onEndClick}>End</Button> */}
      </div>
      <ul>
        {hand.map((card, index) => (
          <li
            style={{
              borderColor: theme.primaryColor,
              backgroundColor:
                selectedCard === index ? theme.primaryColor : undefined,
              color: selectedCard === index ? theme.backgroundColor : undefined,
            }}
            className={selectedCard === index ? "selected" : ""}
            onClick={() => setSelectedCard(index)}
          >
            {card.data?.oldCard && (
              <span className="old-card-name">
                {card.data?.oldCard.name} <br />
              </span>
            )}
            {card.name} <br /> {card.range}
          </li>
        ))}
      </ul>
      <Button className="options" onClick={() => setShowOptions(true)}>
        <Sprite src={cogIcon} color={"primaryColor"} />
      </Button>
    </div>
  );
};

export default Bar;
