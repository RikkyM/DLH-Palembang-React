import { Search } from "lucide-react";
import Layout from "../../Layout";

const Index = () => {
  return (
    <Layout title="Penerimaan Retribusi">
      <section className="p-3">
        <div className="mb-3 flex w-full flex-col items-center justify-between gap-3 rounded bg-white p-2 md:flex-row md:gap-0">
          <label
            htmlFor="search"
            className="flex w-full items-center gap-1.5 rounded border bg-white p-2 text-sm shadow md:max-w-80"
          >
            <Search size={20} />
            <input
              autoComplete="off"
              type="search"
              id="search"
              placeholder="Cari nama"
              className="flex-1 outline-none"
              //   value={search}
              //   onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              openModal("create");
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded bg-green-700 px-3 py-2 text-sm text-white outline-none transition-colors duration-300 hover:bg-green-600 md:w-auto"
          >
            <span>Download Laporan</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded bg-white">
          <table className="min-w-full divide-y divide-gray-300 whitespace-nowrap p-3"></table>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
