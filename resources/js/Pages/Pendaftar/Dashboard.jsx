import DashboardPages from "@/Features/Dashboard";
import Layout from "./Layout";

const Dashboard = (props) => {
  return (
    <Layout title="Dashboard">
      <DashboardPages {...props} />
    </Layout>
  );
};

export default Dashboard;
