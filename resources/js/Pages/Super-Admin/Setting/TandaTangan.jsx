import Layout from "../Layout";
import TandaTangan from "@/features/Setting/Tanda-Tangan/TandaTangan"

const Index = (props) => {
  return (
    <Layout title="Penanda Tangan">
      <TandaTangan {...props} />
    </Layout>
  );
};

export default Index;
