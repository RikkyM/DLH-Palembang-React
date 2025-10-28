import TandaTanganForm from "./Components/TandaTanganForm";
import { useTandaTanganForm } from "./hooks/useTandaTanganForm";

const TandaTangan = ({ signatureData: sigData }) => {
  const { data, setData, errors, processing, handleSubmit } =
    useTandaTanganForm(sigData);

  return (
    <>
      <TandaTanganForm
        data={data}
        errors={errors}
        processing={processing}
        onChange={(k, v) => setData(k, v)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default TandaTangan;
