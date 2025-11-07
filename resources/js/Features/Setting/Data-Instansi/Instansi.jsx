import { Head } from "@inertiajs/react";
import InstansiForm from "./Components/InstansiForm";
import { useInstansiForm } from "./Hooks/useInstansiForm";

const Instansi = ({ instansi }) => {
  const { data, setData, errors, processing, handleSubmit } =
    useInstansiForm(instansi);

  return (
    <>
      <Head title="Data Instansi" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <InstansiForm
          instansi={instansi}
          data={data}
          errors={errors}
          processing={processing}
          onChange={(k, v) => setData(k, v)}
          handleSubmit={handleSubmit}
        />
      </section>
    </>
  );
};

export default Instansi;
