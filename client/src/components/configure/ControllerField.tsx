interface Props {
  fieldName: string;
  fieldValue: string;
}

export function ControllerField({ fieldName, fieldValue }: Props) {
  return (
    <div className="card-body">
      <div className="row">
        <div className="col-6 text-end border-end">
          <h5 className="card-title">{fieldName}</h5>
        </div>
        <div className="col-6">
          <h5 className="card-title">{fieldValue}</h5>
        </div>
      </div>
    </div>
  );
}
