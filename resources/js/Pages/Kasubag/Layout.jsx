import MainLayout from "@/Layouts/MainLayout";
import KasubagNavigation from "./Navigation";
import Header from "@/Components/Header";

const Layout = ({ title, children }) => {
  return (
    <MainLayout>
      <KasubagNavigation />
      <section className="max-h-dvh flex-1 overflow-auto">
        <Header title={title} />
        {children}
      </section>
    </MainLayout>
  );
};

export default Layout;
