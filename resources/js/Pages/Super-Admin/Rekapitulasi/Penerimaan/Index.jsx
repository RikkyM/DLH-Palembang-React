import Layout from "../../Layout";
import Penerimaan from '@/Features/Rekapitulasi/Penerimaan/Index';

const Index = (props) => {
  return (
    <Layout title="Penerimaan">
      <Penerimaan {...props} />
    </Layout>
  );
};

export default Index;
