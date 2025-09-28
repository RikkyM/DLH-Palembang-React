import Show from "@/Features/Skrd/Show";
import Layout from "../../Layout";

const Index = (props) => {
  return (
    <Layout title={props.data.namaObjekRetribusi}>
      <Show {...props} />
    </Layout>
  );
};

export default Index;
