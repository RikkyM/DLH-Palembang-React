import Layout from "../../Layout";
import PemohonIndex from "@/Features/Pemohon/Index";

const Index = (props) => {
  return (
    <Layout title="PEMOHON">
      <PemohonIndex {...props} />
    </Layout>
  );
};

export default Index;
