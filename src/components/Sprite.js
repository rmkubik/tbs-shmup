import { h } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import useTheme from "../hooks/useTheme";

const drawImageWithColor = ({ canvas, image, color }) => {
  const context = canvas.getContext("2d");

  // draw image
  context.drawImage(image, 0, 0);

  if (color) {
    // set composite mode
    context.globalCompositeOperation = "source-in";

    // draw color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalCompositeOperation = "source-over";
  }
};

const Sprite = ({ src, color, tileSize = 16, ...props }) => {
  const { theme } = useTheme();
  const canvasRef = useRef();
  const spriteImage = useMemo(() => {
    const sprite = new Image();
    sprite.src = src;

    return sprite;
  }, [src]);

  const drawSpriteWhenReady = () => {
    const canvas = canvasRef.current;

    if (spriteImage.complete) {
      drawImageWithColor({
        canvas,
        image: spriteImage,
        color: theme[color],
      });
    } else {
      spriteImage.onload = () => {
        drawImageWithColor({
          canvas,
          image: spriteImage,
          color: theme[color],
        });
      };
    }
  };

  useEffect(() => {
    drawSpriteWhenReady();

    return () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [theme, src, color]);

  return (
    <canvas width={tileSize} height={tileSize} ref={canvasRef} {...props} />
  );
};

export default Sprite;
