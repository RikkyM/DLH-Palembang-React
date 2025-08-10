import MainLayout from "@/Layouts/MainLayout";
import Sidebar from "@/Components/Sidebar";
import SuperAdminNavigation from "./Navigation";
import Header from "@/Components/Header";

const Layout = ({ title, children }) => {
  return (
    <MainLayout>
      <SuperAdminNavigation />
      <section className="min-h-dvh flex-1 overflow-auto">
        <Header title={title} />
        {children}
      </section>
    </MainLayout>
  );
};

export default Layout;
