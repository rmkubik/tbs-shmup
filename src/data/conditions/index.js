import stalling from "./stalling";
import malfunctioning from "./malfunctioning";

const conditions = {
  default: { onShuffle: (deck) => deck },
  stalling,
  malfunctioning,
};

export default conditions;
