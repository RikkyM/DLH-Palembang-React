import Layout from "../Layout";
import "leaflet/dist/leaflet.css";
import WajibRetribusiShow from "@/Features/Wajib-Retribusi/Show";

const Show = (props) => {
  return (
    <Layout title="FORM OBJEK RETRIBUSI">
      <WajibRetribusiShow {...props} />
    </Layout>
  );
};

export default Show;
