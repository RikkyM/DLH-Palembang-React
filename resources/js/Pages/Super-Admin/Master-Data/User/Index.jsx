import { Search, Users, PencilLine } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { useProvider } from "@/Context/GlobalContext";
import { router } from "@inertiajs/react";
import DialogCreate from "./DialogCreate";
import TableHead from "@/Components/TableHead";
import SmartPagination from "@/Components/SmartPagination";

const Index = ({ users, uptd, filters }) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "id", label: "No", align: "text-center" },
    { key: "namaLengkap", label: "Nama Lengkap", align: "text-left" },
    { key: "username", label: "Username", align: "text-left" },
    { key: "email", label: "Email", align: "text-left" },
    { key: "jabatan", label: "Jabatan", align: "text-left" },
    { key: "kelamin", label: "Kelamin", align: "text-left" },
    { key: "lokasi", label: "Lokasi", align: "text-left" },
    { key: "nip", label: "NIP", align: "text-left" },
    { key: "pangkat", label: "Pangkat", align: "text-left" },
    { key: "role", label: "Role", align: "text-left" },
    { key: "historyLogin", label: "History Login", align: "text-right" },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = {};

      if (search.trim() !== "") params.search = search.trim();
      if (sort && sort !== filters.sort) params.sort = sort;
      if (direction && direction !== filters.direction)
        params.direction = direction;

      router.get(route("super-admin.user.index"), params, {
        preserveState: true,
        replace: true,
        only: ["users"],
        onFinish: () => setIsLoading(false),
      });
    }, 300);

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
    <Layout title="USER / PEGAWAI">
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
              placeholder="Cari nama user..."
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
            <span>Tambah User</span>
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
              ) : !users?.data || users.data.length === 0 ? (
                <tr>
                  <td colSpan="12" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={35} />
                      <p className="text-lg font-medium">Tidak ada data user</p>
                      <p className="text-sm">
                        {search
                          ? `Tidak ditemukan hasil untuk "${search}"`
                          : "Belum ada user yang terdaftar"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.data.map((user, index) => (
                  <tr
                    key={user.id || index}
                    className={`*:p-2 ${index % 2 === 0 ? "bg-[#F7FBFE]" : ""}`}
                  >
                    <td className="text-center">{users.from + index}</td>
                    <td className="capitalize">{user.namaLengkap}</td>
                    <td className="capitalize">{user.username || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td>{user.jabatan || "-"}</td>
                    <td>{user.kelamin || "-"}</td>
                    <td>{user.lokasi || "-"}</td>
                    <td>{user.nip || "-"}</td>
                    <td>{user.pangkat || "-"}</td>
                    <td>{user.role || "-"}</td>
                    <td className="text-right">
                      {Array.isArray(user.historyLogin) &&
                      user.historyLogin.length > 0
                        ? new Date(
                            user.historyLogin[user.historyLogin.length - 1],
                          ).toLocaleDateString("id-ID", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          openModal("edit", user);
                        }}
                        className="rounded-full p-1 outline-none transition-all duration-300 hover:bg-neutral-300"
                      >
                        <PencilLine size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && (
          <SmartPagination
            datas={users}
            filters={allFilters}
            routeName="super-admin.user.index"
          />
        )}
      </section>

      <DialogCreate
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        uptdOptions={uptd}
        user={modalState.data}
        mode={modalState.type}
      />
    </Layout>
  );
};

export default Index;
