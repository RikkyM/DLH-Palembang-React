import Layout from "../Layout";
import Instansi from "@/Features/Setting/Data-Instansi/Instansi";

const DataInstansi = (props) => {
  console.log(props);
  return (
    <Layout title="Data Instansi">
      <Instansi {...props} />
    </Layout>
  );
};

export default DataInstansi;
