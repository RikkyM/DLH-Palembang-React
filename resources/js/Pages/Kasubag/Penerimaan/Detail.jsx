import Layout from "../Layout";
import DetailSetoran from "@/Features/Penerimaan/Detail";

const Detail = (props) => {
  return (
    <Layout title="Detail Setoran">
      <DetailSetoran {...props} />
    </Layout>
  );
};

export default Detail;
