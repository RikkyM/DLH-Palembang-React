import { Filter, PencilLine, Search, Trash } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "@/Context/GlobalContext";
import SmartPagination from "@/Components/SmartPagination";
import TableHead from "@/Components/TableHead";
import { router } from "@inertiajs/react";
import DialogForm from "./DialogForm";

const Index = ({ datas, filters, kecamatanOptions, kelurahanOptions }) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || "");
  const [direction, setDirection] = useState(filters.direction || "asc");
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "id", label: "No", align: "text-left" },
    { key: "nik", label: "NIK", align: "text-left" },
    { key: "namaPemilik", label: "Nama Pemilik", align: "text-left" },
    { key: "alamat", label: "Alamat", align: "text-left" },
    { key: "tempatLahir", label: "Tempat Lahir", align: "text-left" },
    { key: "tanggalLahir", label: "Tanggal Lahir", align: "text-left" },
    { key: "kodeKecamatan", label: "Kecamatan", align: "text-left" },
    { key: "kodeKelurahan", label: "Kelurahan", align: "text-left" },
    { key: "noHp", label: "Nomor Hp", align: "text-left" },
    { key: "email", label: "Email", align: "text-left" },
    { key: "jabatan", label: "Jabatan", align: "text-left" },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = {};

      if (search && search.trim() !== "") params.search = search;
      if (sort && sort !== filters.sort) params.sort = sort;
      if (direction && direction !== filters.direction)
        params.direction = direction;

      router.get(route("super-admin.pemohon.index"), params, {
        preserveState: true,
        replace: true,
        only: ["datas"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [search, sort, direction]);

  const allFilters = {
    search: search || filters.search,
    sort: sort || filters.sort,
    direction: direction || filters.direction,
  };

  return (
    <Layout title="PEMOHON">
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
              placeholder="Cari nama..."
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
            <span>Tambah Pemohon</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded bg-white">
          <table className="min-w-full divide-y divide-gray-300 whitespace-nowrap p-3">
            <thead>
              <TableHead
                columns={columns}
                sort={sort}
                direction={direction}
                onSort={(column, dir) => {
                  setSort(column);
                  setDirection(dir);
                }}
              />
            </thead>
            <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={12}>
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
                    <td>{data.nik}</td>
                    <td>{data.namaPemilik}</td>
                    <td>{data.alamat}</td>
                    <td>{data.tempatLahir}</td>
                    <td>
                      {data.tanggalLahir &&
                        new Date(data.tanggalLahir)
                          .toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")}
                    </td>
                    <td>{data.kecamatan.namaKecamatan}</td>
                    <td>{data.kelurahan.namaKelurahan}</td>
                    <td>{data.noHP}</td>
                    <td>{data.email}</td>
                    <td>{data.jabatan}</td>
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
                      {/* <button
                                                type="button"
                                                onClick={() => {
                                                    openModal("delete", data);
                                                }}
                                                className="rounded-full outline-none p-1 hover:bg-neutral-300 transition-all duration-300"
                                            >
                                                <Trash size={20} />
                                            </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="py-8 text-center text-gray-500">
                    {search
                      ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                      : "Belum ada data Pemohon"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && <SmartPagination datas={datas} filters={allFilters} />}
      </section>
      <DialogForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        pemohon={modalState.data}
        mode={modalState.type}
        kecamatanOptions={kecamatanOptions}
        kelurahanOptions={kelurahanOptions}
      />
    </Layout>
  );
};

export default Index;
