const createPlayer = ({ index, ship }) => {
  return {
    name: "🔺",
    index,
    img: ship.icon,
    color: ship.color,
    isPlayer: true,
    speed: 0,
  };
};

export default createPlayer;
