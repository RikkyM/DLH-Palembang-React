const MainLayout = ({ children }) => {
  return (
    <section className="flex flex-1 overflow-auto bg-neutral-100">
      {children}
    </section>
  );
};

export default MainLayout;
