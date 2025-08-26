import Layout from "../../Layout";
import "leaflet/dist/leaflet.css";
import WajibRetribusiEdit from "@/Features/Wajib-Retribusi/Edit";

const Edit = (props) => {
  return (
    <Layout title="FORM OBJEK RETRIBUSI">
      <WajibRetribusiEdit {...props} />
    </Layout>
  );
};

export default Edit;
