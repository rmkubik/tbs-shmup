import { h, Fragment } from "preact";

import Status from "./Status";

const SystemsList = ({ sector }) => {
  const { conditions = [] } = sector;

  const scannersStatus = conditions.includes("nebula") ? "offline" : "online";

  let navigationStatus = "online";

  if (conditions.includes("left-offline")) {
    navigationStatus = "left-offline";
  }
  if (conditions.includes("malfunctioning")) {
    navigationStatus = "malfunctioning";
  }

  const enginesStatus = conditions.includes("stalling") ? "stalling" : "online";

  return (
    <Fragment>
      <p>Ship Systems</p>
      <ul>
        <li>
          SCANNERS: <Status status={scannersStatus} />
        </li>
        <li>
          NAVIGATION: <Status status={navigationStatus} />
        </li>
        <li>
          ENGINES: <Status status={enginesStatus} />
        </li>
      </ul>
    </Fragment>
  );
};

export default SystemsList;
