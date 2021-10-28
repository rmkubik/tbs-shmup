import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import useTheme from "../hooks/useTheme";

const Sprite = ({ src, color, ...props }) => {
  const { theme } = useTheme();
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const sprite = new Image();
    sprite.src = src;
    sprite.onload = () => {
      // draw image
      context.drawImage(sprite, 0, 0);

      console.log({ src, color });

      if (color) {
        // set composite mode
        context.globalCompositeOperation = "source-in";

        // draw color
        context.fillStyle = theme[color];
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.globalCompositeOperation = "source-over";
      }
    };
  }, []);

  return <canvas width="16" height="16" ref={canvasRef} {...props} />;
};

export default Sprite;
