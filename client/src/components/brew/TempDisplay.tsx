interface Props {
  temperature: number | "--";
  units: "F" | "C";
}

export function TemperatureDisplay(props: Props) {
  const { temperature, units } = props;
  return (
    <div>
      <h1 className="display-2">
        {temperature}&#176;{units}
      </h1>
    </div>
  );
}
