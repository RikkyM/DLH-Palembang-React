import { router } from "@inertiajs/react";
import Layout from "./Layout";

const Dashboard = ({ year, years, stats }) => {
  const handleChangeYear = (y) => {
    router.get(
      route("super-admin.dashboard"),
      { year: y },
      { preserveState: true },
    );
  };
  return (
    <Layout title="Dashboard">
      <section className="min-h-screen overflow-hidden p-3">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => handleChangeYear(y)}
            className={`rounded px-4 py-2 ${
              parseInt(y) === parseInt(year)
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {y}
            {/* {console.log(y)} */}
          </button>
        ))}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded bg-white p-4 shadow">
            Jumlah Wajib Retribusi: {stats.jumlahWR}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Jumlah SKRD: {stats.jumlahSkrd}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Proyeksi Penerimaan:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(stats.proyeksiPenerimaan)}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Penerimaan:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(stats.penerimaan)}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Belum Tertagih:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(stats.belumTertagih)}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Penerimaan Hari ini:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(stats.penerimaanHariIni)}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Penerimaan Bulan ini:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(stats.penerimaanBulanIni)}
          </div>
          <div className="rounded bg-white p-4 shadow">
            Penerimaan Tahun ini:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(stats.penerimaanTahunIni)}
          </div>
          {/* Tambahkan kartu lainnya */}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
