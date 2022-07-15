import { ChangeEvent } from "react";

interface Props {
  breweryStatus: string;
}

export function BrewerySwitchBar({ breweryStatus }: Props) {

  const handleChange = (c: ChangeEvent<HTMLInputElement>) => {
    // setActive(c.target.checked);

  };

  return (
    <div className="">
      <h2 className="text-center">Brewery Control Switch</h2>
      <div className="form-check form-switch d-flex justify-content-center">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
          onChange={handleChange}
        />
        <label className="form-check-label">Brewery {breweryStatus}</label>
      </div>
    </div>
  );
}
