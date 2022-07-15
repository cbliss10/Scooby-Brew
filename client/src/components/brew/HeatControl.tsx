import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleUp,
  faAngleDoubleUp,
  faAngleDown,
  faAngleDoubleDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleUp, faAngleDoubleUp, faAngleDown, faAngleDoubleDown);

const PowerLevelDisplay = (props: { powerLevel: number | "NA" }) => {
  const { powerLevel } = props;
  return (
    <div className="d-flex align-items-center justify-content-center col">
      <h1 className="display-2">{powerLevel}%</h1>
    </div>
  );
};

const PowerLevelControl = (props: {
  onClick: (adjustment: number) => void;
}) => {
  const { onClick } = props;
  return (
    <div className="d-flex flex-column col-auto">
      <button
        type="button"
        className="btn btn-primary my-1"
        onClick={() => onClick(1)}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </button>
      <button
        type="button"
        className="btn btn-primary my-1"
        onClick={() => onClick(10)}
      >
        <FontAwesomeIcon icon={faAngleDoubleUp} />
      </button>
      <button
        type="button"
        className="btn btn-primary my-1"
        onClick={() => onClick(-10)}
      >
        <FontAwesomeIcon icon={faAngleDoubleDown} />
      </button>
      <button
        type="button"
        className="btn btn-primary my-1"
        onClick={() => onClick(-1)}
      >
        <FontAwesomeIcon icon={faAngleDown} />
      </button>
    </div>
  );
};

export function PowerLevelComponent(props: {
  powerLevel: number | "NA";
  adjustPowerLevel: (adjustment: number) => void;
}) {
  const { powerLevel, adjustPowerLevel } = props;

  // should have access to adjustPowerLevel function
  // should have props for current power level

  return (
    <div className="d-flex flex-row row">
      <PowerLevelDisplay powerLevel={powerLevel} />
      <PowerLevelControl onClick={adjustPowerLevel} />
    </div>
  );
}
