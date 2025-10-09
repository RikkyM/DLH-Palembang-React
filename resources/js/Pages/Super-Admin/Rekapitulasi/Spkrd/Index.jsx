import Layout from "../../Layout";
import Index from "@/Features/Rekapitulasi/Spkrd/Index";

const Spkrd = (props) => {
  return (
    <Layout title="REKAPITULASI SPKRD">
      <Index {...props} />
    </Layout>
  );
};

export default Spkrd;
