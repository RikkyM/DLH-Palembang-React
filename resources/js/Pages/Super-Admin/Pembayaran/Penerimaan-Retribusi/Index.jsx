import { Search } from "lucide-react";
import Layout from "../../Layout"

const Index = () => {
  return (
      <Layout title="Penerimaan Retribusi">
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
                  <button
                      onClick={() => {
                          openModal("create");
                      }}
                      className="flex justify-center items-center gap-1.5 text-sm bg-green-700 hover:bg-green-600 transition-colors duration-300 px-3 py-2 text-white w-full md:w-auto rounded outline-none"
                  >
                      <span>Download Laporan</span>
                  </button>
              </div>

              <div className="overflow-x-auto bg-white rounded">
                <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
                      
                </table>
              </div>
          </section>
      </Layout>
  );
}

export default Index