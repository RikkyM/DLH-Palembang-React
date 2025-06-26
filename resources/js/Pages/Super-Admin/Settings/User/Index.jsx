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
        const timeoutId = setTimeout(() => {
            const params = {};

            if (search.trim() !== "") params.search = search.trim();
            if (sort && sort !== filters.sort) params.sort = sort;
            if (direction && direction !== filters.direction) params.direction = direction;

            router.get(route("super-admin.user"), params, {
                preserveState: true,
                replace: true,
                only: ["users"],
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, sort, direction]);

    const allFilters = {
        search: search || filters.search,
        sort: sort || filters.sort,
        direction: direction || filters.direction,
    };

    return (
        <Layout title="USER / PEGAWAI">
            <section className="p-3">
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between w-full mb-3 bg-white p-2 rounded">
                    <label
                        htmlFor="search"
                        className="flex items-center gap-1.5 bg-white p-2 w-full md:max-w-80 text-sm rounded shadow border"
                    >
                        <Search size={20} />
                        <input
                            autoComplete="off"
                            type="search"
                            id="search"
                            placeholder="Cari nama user..."
                            className="outline-none flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <button
                        onClick={() => {
                            openModal("create");
                        }}
                        className="flex justify-center items-center gap-1.5 text-sm bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-2 text-white w-full md:w-auto rounded outline-none"
                    >
                        <span>Tambah User</span>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
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
                        <tbody className="text-xs md:text-sm divide-y divide-neutral-300">
                            {!users?.data || users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="12"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={35} />
                                            <p className="text-lg font-medium">
                                                Tidak ada data user
                                            </p>
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
                                        className={`*:p-2 ${
                                            index % 2 === 0
                                                ? "bg-[#F7FBFE]"
                                                : ""
                                        }`}
                                    >
                                        <td className="text-center">
                                            {users.from + index}
                                        </td>
                                        <td className="capitalize">
                                            {user.namaLengkap}
                                        </td>
                                        <td className="capitalize">
                                            {user.username || "-"}
                                        </td>
                                        <td>{user.email || "-"}</td>
                                        <td>{user.jabatan || "-"}</td>
                                        <td>{user.kelamin || "-"}</td>
                                        <td>{user.lokasi || "-"}</td>
                                        <td>{user.nip || "-"}</td>
                                        <td>{user.pangkat || "-"}</td>
                                        <td>{user.role || "-"}</td>
                                        <td className="text-right">
                                            {user.historyLogin
                                                ? new Date(
                                                      user.historyLogin
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          weekday: "short",
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                          hour: "numeric",
                                                          minute: "2-digit",
                                                          hour12: true,
                                                      }
                                                  )
                                                : "-"}
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => {
                                                    openModal("edit", user);
                                                }}
                                                className="rounded-full outline-none p-1 hover:bg-neutral-300 transition-all duration-300"
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

                <SmartPagination
                    datas={users}
                    filters={allFilters}
                    routeName="super-admin.user"
                />
            </section>

            <DialogCreate
                isOpen={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
                uptdOptions={uptd}
                user={modalState.data}
                mode={modalState.type}
            />
        </Layout>
    );
};

export default Index;
