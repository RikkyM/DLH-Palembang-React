import Index from "@/Features/Rekapitulasi/Retribusi-Kecamatan/Detail";
import Layout from "../../Layout";

const Detail = (props) => {
  const { filters } = props;

  return (
    <Layout title={`${filters.kecamatan}`}>
      <Index {...props} />
    </Layout>
  );
};

export default Detail;
