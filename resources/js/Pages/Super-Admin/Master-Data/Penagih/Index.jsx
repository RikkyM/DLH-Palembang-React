import Layout from "../../Layout";
import { useProvider } from "@/Context/GlobalContext";
import { PencilLine, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DialogForm from "./DialogForm";
import { router } from "@inertiajs/react";
import SmartPagination from "@/Components/SmartPagination";

const Index = ({ datas, filters, uptdOptions = [] }) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = {};

      if (search && search.trim() !== "") params.search = search;

      router.get(route("super-admin.penagih.index"), params, {
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
    <Layout title="Penagih">
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
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
              placeholder="Cari penagih..."
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
            <span>Tambah Data</span>
          </button>
        </div>
        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_210px)] lg:max-h-[calc(100%_-_150px)] ${!isLoading && "shadow"}`}
        >
          {isLoading ? (
            <div className="mb-2 flex h-16 items-center justify-center gap-2 bg-white px-2 text-sm text-gray-500 shadow">
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
          ) : (
            <table className="min-w-full divide-y divide-gray-300 p-3">
              <thead>
                <tr className="text-white *:bg-[#F1B174] *:p-2 *:text-sm *:font-medium truncate">
                  <th className="w-16 text-center">No</th>
                  <th className="text-left">Nama Penagih</th>
                  <th className="text-left">Jabatan</th>
                  <th className="text-left">Status Pegawai</th>
                  <th className="text-left">Wilayah UPTD</th>
                  <th className="sticky right-0 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
                {datas?.data?.length > 0 ? (
                  datas.data.map((data, index) => (
                    <tr
                      key={data.id || index}
                      className={`*:p-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                    >
                      <td className="text-center">
                        {(datas.current_page - 1) * datas.per_page + index + 1}
                      </td>
                      <td>{data.nama}</td>
                      <td>{data.jabatan}</td>
                      <td>{data.statusPegawai}</td>
                      <td>{data.wilayah_uptd}</td>
                      <td
                        className={`sticky right-0 space-x-1 text-right md:space-x-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            openModal("edit", data);
                          }}
                          className="rounded-full p-1 outline-none transition-all duration-300 hover:bg-neutral-300"
                        >
                          <PencilLine size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      {search
                        ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                        : "Belum ada data Penagih"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {!isLoading && <SmartPagination datas={datas} filters={filters} />}
      </section>
      <DialogForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        mode={modalState.type}
        penagih={modalState.data}
        uptdOptions={uptdOptions}
      />
    </Layout>
  );
};

export default Index;
