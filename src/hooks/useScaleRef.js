import { useEffect, useRef } from "preact/hooks";

const scaleToFitWindow = (node) => {
  if (!node) {
    // If no node is provided, do nothing
    return;
  }

  const { clientWidth, clientHeight } = node;
  const { innerWidth, innerHeight } = window;

  const scales = [
    // X scale
    Math.max(clientWidth, innerWidth) / Math.min(clientWidth, innerWidth),
    // Y scale
    Math.max(clientHeight, innerHeight) / Math.min(clientHeight, innerHeight),
  ];

  node.style.transform = `scale(${Math.min(...scales)})`;
};

const useScaleRef = () => {
  const scaleRef = useRef();

  useEffect(() => {
    const scaleToFitWindowWithRef = () => scaleToFitWindow(scaleRef.current);

    scaleToFitWindowWithRef();

    window.addEventListener("resize", scaleToFitWindowWithRef);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        scaleToFitWindow(entry.target);
      }
    });

    resizeObserver.observe(scaleRef.current);

    return () => {
      window.removeEventListener("resize", scaleToFitWindowWithRef);
      resizeObserver.disconnect();
    };
  }, []);

  return scaleRef;
};

export default useScaleRef;
