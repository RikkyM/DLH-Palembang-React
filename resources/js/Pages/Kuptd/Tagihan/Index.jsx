import Layout from "../Layout";
import Invoice from "@/Features/Tagihan/Index";

const Index = (props) => {
  return (
    <Layout title="Data Surat Tagihan">
      <Invoice {...props} />
    </Layout>
  );
};

export default Index;
