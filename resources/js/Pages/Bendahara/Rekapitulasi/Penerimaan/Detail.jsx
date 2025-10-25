import Index from "@/Features/Rekapitulasi/Penerimaan/Detail";
import Layout from "../../Layout";

const Detail = (props) => {
  const { filters } = props;

  return (
    <Layout title={`${filters.uptd}`}>
      <Index {...props} />
    </Layout>
  );
};

export default Detail;
