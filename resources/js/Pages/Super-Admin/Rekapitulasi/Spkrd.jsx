import Layout from "../Layout";
import Index from "@/Features/Rekapitulasi/Spkrd";

const Spkrd = (props) => {
  return (
    <Layout title="REKAPITULASI SPKRD">
      <Index {...props} />
    </Layout>
  );
};

export default Spkrd;
