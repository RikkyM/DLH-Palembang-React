import React from "react";
import TandaTanganForm from "./Components/TandaTanganForm";
import { useTandaTanganForm } from "./Hooks/useTandaTanganForm";

const TandaTangan = ({ signatureData: sigData }) => {
  const { data, setData, errors, processing, handleSubmit } =
    useTandaTanganForm(sigData);

  return (
    <React.Fragment key={sigData?.id || sigData?.nama}>
      <TandaTanganForm
        data={data}
        errors={errors}
        processing={processing}
        onChange={(k, v) => setData(k, v)}
        onSubmit={handleSubmit}
      />
    </React.Fragment>
  );
};

export default TandaTangan;
