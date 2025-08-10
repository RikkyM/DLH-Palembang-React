import { Head } from "@inertiajs/react";

const MainLayout = ({ title = "Wajib Retribusi", children }) => {
  return (
    <section className="flex h-full min-h-dvh bg-neutral-100">
      <Head title={title} />
      {children}
    </section>
  );
};

export default MainLayout;
