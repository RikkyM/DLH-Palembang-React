import { PencilLine, Search, Trash } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import SmartPagination from "@/Components/SmartPagination";
import { useProvider } from "@/Context/GlobalContext";
import DialogForm from "./DialogForm";
import DialogDelete from "./DialogDelete";

const Index = ({ datas, filters }) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = {};

      if (search && search.trim() !== "") params.search = search;

      router.get(route("super-admin.kategori.index"), params, {
        preserveState: true,
        replace: true,
        only: ["datas"],
        onFinish: () => setIsLoading(false),
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [search]);

  return (
    <Layout title="KATEGORI">
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
              placeholder="Cari nama kategori..."
              className="flex-1 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              openModal("create");
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded bg-green-500 px-3 py-2 text-sm text-white outline-none md:w-auto"
          >
            <span>Tambah Kategori</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded bg-white">
          <table className="min-w-full divide-y divide-gray-300 whitespace-nowrap p-3">
            <thead>
              <tr className="*:p-2 *:text-sm *:font-medium">
                <th className="text-center">No</th>
                <th className="text-left">Kode Kategori</th>
                <th className="text-left">Nama Kategori</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="mb-2 flex h-16 items-center justify-center gap-2 px-2 text-sm text-gray-500">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : datas?.data?.length > 0 ? (
                datas.data.map((data, index) => (
                  <tr
                    key={data.id || index}
                    className={`*:p-2 ${index % 2 === 0 ? "bg-[#F7FBFE]" : ""}`}
                  >
                    <td className="text-center">
                      {(datas.current_page - 1) * datas.per_page + index + 1}
                    </td>
                    <td>{data.kodeKategori}</td>
                    <td>{data.namaKategori}</td>
                    <td className="space-x-1 text-right md:space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          openModal("edit", data);
                        }}
                        className="rounded-full p-1 outline-none transition-all duration-300 hover:bg-neutral-300"
                      >
                        <PencilLine size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openModal("delete", data);
                        }}
                        className="rounded-full p-1 outline-none transition-all duration-300 hover:bg-neutral-300"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    {search
                      ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                      : "Belum ada data Kategori"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && <SmartPagination datas={datas} filters={filters} />}
      </section>

      <DialogForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        mode={modalState.type}
        kategori={modalState.data}
      />

      <DialogDelete
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        kategori={modalState.data}
      />
    </Layout>
  );
};

export default Index;
