import Layout from "../../Layout";
import { useProvider } from "@/Context/GlobalContext";
import { Search } from "lucide-react";
import DialogForm from "./DialogForm";
import { useMemo } from "react";

const Index = ({ retribusiOptions = [] }) => {
    const { modalState, openModal, closeModal } = useProvider();

    return (
        <Layout title="Invoice">
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
                            placeholder="Cari nama"
                            className="outline-none flex-1"
                            //   value={search}
                            //   onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <div className="flex items-center justify-end md:justify-start gap-1.5 flex-wrap">
                        <button
                            onClick={() => {
                                openModal("create");
                            }}
                            className="bg-green-500 px-3 py-1.5 rounded text-sm text-white font-medium"
                        >
                            Tambah
                        </button>
                        <button className="bg-red-500 px-3 py-1.5 rounded text-sm text-white font-medium">
                            <span>PDF</span>
                        </button>
                        <button className="px-3 py-1.5 bg-green-700 rounded text-white text-sm font-medium ">
                            <span>Excel</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="p-3 min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr className="*:font-medium *:text-sm *:p-2 *:uppercase *:whitespace-nowrap">
                                <th>No</th>
                                <th>no skrd</th>
                                <th>no wajib retribusi</th>
                                <th>nama wajib retribusi</th>
                                <th>alamat layanan</th>
                                <th>jumlah</th>
                                <th>satuan</th>
                                <th>tarif retribusi</th>
                                <th>sub total</th>
                                <th>total retribusi</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </section>

            <DialogForm
                isOpen={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
                mode={modalState.type}
                invoice={modalState.data}
                retribusiOptions={retribusiOptions}
            />
        </Layout>
    );
};

export default Index;
