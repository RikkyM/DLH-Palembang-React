import Index from "@/Features/Rekapitulasi/Spkrd/Detail";
import Layout from "../../Layout";

const Detail = (props) => {
  const { filters } = props;

  return (
    <Layout title={`${filters.kategori} - ${filters.sub_kategori}`}>
      <Index {...props} />
    </Layout>
  );
};

export default Detail;
