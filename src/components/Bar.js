import { h } from "preact";

import cogIcon from "../../assets/cog.png";

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
  return (
    <div className="bar">
      <div>
        <p>
          PWR: {power}/{maxPower}
        </p>
        <button disabled={hasUsedShipPower} onClick={onRecycleClick}>
          {hasUsedShipPower ? "Recharging..." : "Recycle"}
        </button>
        {/* <button onClick={onEndClick}>End</button> */}
      </div>
      <ul>
        {hand.map((card, index) => (
          <li
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
      <button className="options" onClick={() => setShowOptions(true)}>
        <img src={cogIcon} />
      </button>
    </div>
  );
};

export default Bar;
