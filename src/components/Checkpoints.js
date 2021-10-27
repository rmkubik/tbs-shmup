import { h, Fragment } from "preact";

const Checkpoints = ({ sectors, lastCheckpoint, winStreak }) => {
  const completedSectors = sectors.slice(0, winStreak);
  const remainingSectors = sectors.slice(winStreak + 1);

  const nextCheckpoint =
    remainingSectors.findIndex((sector) =>
      sector.conditions.includes("checkpoint")
    ) +
    // Add completed sector amount back on
    completedSectors.length +
    // Add current sector back on
    1;

  let nextCheckpointComponent = (
    <p className="streak">Victory at Sector: {sectors.length}</p>
  );

  if (nextCheckpoint !== -1) {
    nextCheckpointComponent = (
      <p className="streak">Next Checkpoint: {nextCheckpoint + 1}</p>
    );
  }

  return (
    <Fragment>
      <p className="streak">Last Checkpoint: {lastCheckpoint + 1}</p>
      {nextCheckpointComponent}
    </Fragment>
  );
};

export default Checkpoints;
