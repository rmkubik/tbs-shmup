import { h, Fragment } from "preact";

import Condition from "./Condition";

const SectorConditions = ({ sector, title }) => {
  const { conditions = {} } = sector;

  return (
    <Fragment>
      <p>{title}</p>
      <ul>
        {conditions.map((condition) => (
          <Condition condition={condition} />
        ))}
      </ul>
    </Fragment>
  );
};

export default SectorConditions;
