import Layout from "./Layout";
import DashboardPages from "@/Features/Dashboard";

// const Dashboard = ({ year, years, stats, chart, chartKecamatan }) => {
const Dashboard = (props) => {
  return (
    <Layout title="Dashboard">
      <DashboardPages {...props} />
    </Layout>
  );
};

export default Dashboard;
