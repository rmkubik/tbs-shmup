import { useEffect, useRef } from "preact/hooks";

const setStyles = (node, styles) => {
  Object.entries(styles).forEach(([style, value]) => {
    node.style[style] = value;
  });
};

const useBodyStyle = (style) => {
  const bodyRef = useRef();

  useEffect(() => {
    const body = document.querySelector("body");
    bodyRef.current = body;

    setStyles(bodyRef.current, style);
  }, [style]);

  const setStyle = (newStyle) => {
    setStyles(bodyRef.current, newStyle);
  };

  return setStyle;
};

export default useBodyStyle;
