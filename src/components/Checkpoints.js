import { h, Fragment } from "preact";

const Checkpoints = ({ sectors, lastCheckpoint, winStreak }) => {
  const nextCheckpoint = sectors
    .slice(winStreak + 1)
    .findIndex((sector) => sector.conditions.includes("checkpoint"));

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
