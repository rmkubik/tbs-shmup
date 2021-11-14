import cubeIcon from "../../../assets/cube.png";

function createMetalCube({ index }) {
  return {
    name: "🪨",
    speed: 4,
    index,
    img: cubeIcon,
    color: "metallicColor",
    isCollisionImmune: true,
    isExplosive: false,
  };
}

export default createMetalCube;
