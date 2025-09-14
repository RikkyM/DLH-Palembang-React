import { router } from "@inertiajs/react";

import { Clock, DollarSign, FileText, Users, Wallet } from "lucide-react";
import BarChart from "@/Components/Chart/BarChart";
import PieChart from "@/Components/Chart/PieChart";

const DashboardPages = ({
  year,
  years,
  stats,
  chart,
  chartKecamatan,
  rute,
}) => {
  const handleChangeYear = (y) => {
    router.get(route(rute), { year: y }, { preserveState: true });
  };
  console.log(year);
  return (
    <section className="relative min-h-screen overflow-hidden p-3">
      <div>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => handleChangeYear(y)}
            className={`mx-1 rounded px-4 py-2 text-xs outline-none md:text-sm ${
              parseInt(y) === parseInt(year)
                ? "bg-[#B3CEAF] text-white"
                : "border border-gray-300 bg-white text-gray-800 shadow"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="order-1 col-span-2 mt-2 grid gap-2 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#84BAFF] p-2">
                <Users className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Jumlah Wajib Retribusi</span>
              <span className="font-semibold text-[#84BAFF]">
                {stats.jumlahWR}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#A2A1F0] p-2">
                <FileText className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Jumlah SKRD</span>
              <span className="font-semibold text-[#4C60AE]">
                {stats.jumlahSkrd}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#2BBB7A] p-2">
                <Wallet className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Proyeksi Penerimaan</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(stats.proyeksiPenerimaan)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#2BBB7A] p-2">
                <DollarSign className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Penerimaan</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(stats.penerimaan)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-amber-500 p-2">
                <Clock className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Belum Tertagih</span>
              <span className="flex flex-wrap font-semibold text-amber-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(stats.belumTertagih)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#2BBB7A] p-2">
                <DollarSign className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Penerimaan Hari Ini</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(stats.penerimaanHariIni)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#2BBB7A] p-2">
                <DollarSign className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Penerimaan Bulan Ini</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(stats.penerimaanBulanIni)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-7 shadow">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#2BBB7A] p-2">
                <DollarSign className="size-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Penerimaan Tahun Ini</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(stats.penerimaanTahunIni)}
              </span>
            </div>
          </div>
        </div>
        <div className="order-3 col-span-2 row-span-1 rounded border border-gray-300 bg-white px-10 py-6 shadow sm:row-span-2 lg:order-2 lg:col-span-1 lg:mt-2">
          <h2 className="mb-4 text-lg font-semibold">
            Penerimaan Kecamatan {year}
          </h2>
          <PieChart labels={chartKecamatan.labels} data={chartKecamatan.data} />
        </div>
        <div className="order-2 col-span-2 rounded border border-gray-300 bg-white p-6 shadow lg:order-3">
          <h2 className="mb-4 text-lg font-semibold">
            Grafik Penerimaan Tahun {year}
          </h2>
          <BarChart labels={chart.labels} data={chart.data} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPages;
