import asteroidIcon1 from "../../../assets/asteroid1.png";
import asteroidIcon2 from "../../../assets/asteroid2.png";
import asteroidIcon3 from "../../../assets/asteroid3.png";
import asteroidIcon4 from "../../../assets/asteroid4.png";

function createAsteroid({ speed, index }) {
  let img;

  if (speed <= 2) {
    img = asteroidIcon1;
  } else if (speed > 2 && speed <= 3) {
    img = asteroidIcon2;
  } else if (speed > 3 && speed <= 4) {
    img = asteroidIcon3;
  } else if (speed >= 5) {
    img = asteroidIcon4;
  }

  return {
    name: "🪨",
    speed,
    index,
    img,
    color: "hazardColor",
  };
}

export default createAsteroid;
