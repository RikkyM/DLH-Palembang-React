import Layout from "../../Layout";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import WajibRetribusiEdit from "@/Features/Wajib-Retribusi/Edit";

const Edit = (props) => {
  return (
    <Layout title="FORM OBJEK RETRIBUSI">
      <WajibRetribusiEdit {...props} />
    </Layout>
  );
};

export default Edit;
