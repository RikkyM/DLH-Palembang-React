import MainLayout from "@/Layouts/MainLayout";
import SuperAdminNavigation from "./Navigation";
import Header from "@/Components/Header";

const Layout = ({ title, children }) => {
  return (
    <MainLayout>
      <SuperAdminNavigation />
      <section className="h-screen flex-1 overflow-auto">
        <Header title={title} />
        {children}
      </section>
    </MainLayout>
  );
};

export default Layout;
