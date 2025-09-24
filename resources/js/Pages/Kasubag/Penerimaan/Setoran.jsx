import Layout from "../Layout";
import InputSetoran from "@/Features/Penerimaan/Setoran";

const Setoran = (props) => {
  return (
    <Layout title="Input Setoran">
      <InputSetoran {...props} />
    </Layout>
  );
};

export default Setoran;
