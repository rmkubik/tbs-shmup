import { h } from "preact";

const Status = ({ status }) => {
  switch (status) {
    case "offline":
      return <span className="nebula status">OFFLINE</span>;
    case "stalling":
      return <span className="caution status">STALLING</span>;
    case "left-offline":
      return <span className="negative status">LEFT THRUSTER OFFLINE</span>;
    case "malfunctioning":
      return <span className="caution status">MALFUNCTIONING</span>;
    default:
      return <span className="positive status">ONLINE</span>;
  }
};

export default Status;
