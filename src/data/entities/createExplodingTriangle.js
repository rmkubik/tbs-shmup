import triangleIcon from "../../../assets/triangle.png";

function createExplodingTriangle({ index }) {
  return {
    name: "🪨",
    speed: 3,
    index,
    img: triangleIcon,
    color: "bombColor",
    isCollisionImmune: true,
    isExplosive: false,
  };
}

export default createExplodingTriangle;
