import MainLayout from "@/Layouts/MainLayout";
import KabidNavigation from "./Navigation";
import Header from "@/Components/Header";

const Layout = ({ title, children }) => {
  return (
    <MainLayout>
      <KabidNavigation />
      <section className="max-h-dvh flex-1 overflow-auto">
        <Header title={title} />
        {children}
      </section>
    </MainLayout>
  );
};

export default Layout;
