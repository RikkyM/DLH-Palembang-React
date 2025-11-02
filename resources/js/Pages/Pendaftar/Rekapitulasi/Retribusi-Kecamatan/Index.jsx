import Layout from "../../Layout";
import Kecamatan from "@/Features/Rekapitulasi/Retribusi-Kecamatan/Index.jsx";

const Index = (props) => {
  return (
    <Layout title="Retribusi Kecamatan">
      <Kecamatan {...props} />
    </Layout>
  );
};

export default Index;
