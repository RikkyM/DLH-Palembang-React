import Layout from "../../Layout";
import Penerimaan from "@/Features/Rekapitulasi/Nota-Tagihan/Index";

const Index = (props) => {
  return (
    <Layout title="Nota Tagihan">
      <Penerimaan {...props} />
    </Layout>
  );
};

export default Index;
