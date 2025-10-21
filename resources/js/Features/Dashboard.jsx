import { Deferred, Head, Link, router, usePage } from "@inertiajs/react";

import { Clock, DollarSign, FileText, Users, Wallet } from "lucide-react";
import BarChart from "@/Components/Chart/BarChart";
import PieChart from "@/Components/Chart/PieChart";
import { useState } from "react";

const DashboardPages = ({
  year,
  years,
  stats,
  chart,
  chartKecamatan,
  rute,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <section className="relative min-h-screen touch-pan-y overflow-hidden p-3">
      <Head title="Dashboard" />
      <Deferred data={["years", "year"]} fallback={<p>Memuat...</p>}>
        {years?.map((y) => (
          <Link
            key={y}
            as="button"
            href={route(rute, { year: y })}
            preserveState
            preserveScroll
            replace
            prefetch
            cacheFor="2m"
            onStart={() => setLoading(true)}
            onFinish={() => setLoading(false)}
            only={["year", "years", "stats", "chart", "chartKecamatan"]}
            className={`mx-1 rounded px-4 py-2 text-xs outline-none md:text-sm ${
              parseInt(y) === parseInt(year)
                ? "bg-[#B3CEAF] text-white"
                : "border border-gray-300 bg-white text-gray-800 shadow"
            }`}
          >
            {y}
          </Link>
        ))}
      </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading && (stats?.jumlahWR ?? 0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading && (stats?.jumlahSkrd ?? 0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.proyeksiPenerimaan) ??
                      0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.penerimaan) ??
                      0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.belumTertagih) ??
                      0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.penerimaanHariIni) ??
                      0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.penerimaanBulanIni) ??
                      0)}
                </Deferred>
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
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.penerimaanTahunIni) ??
                      0)}
                </Deferred>
              </span>
            </div>
          </div>
        </div>
        <div className="order-3 col-span-2 row-span-1 rounded border border-gray-300 bg-white px-10 py-6 shadow sm:row-span-2 lg:order-2 lg:col-span-1 lg:mt-2">
          <h2 className="mb-4 text-lg font-semibold">
            Penerimaan Kecamatan{" "}
            <Deferred data="year" fallback={<span>Memuat...</span>}>
              {loading && <span>Memuat...</span>}
              {!loading && year}
            </Deferred>
          </h2>
          {/* {chartKecamatan && (
            
          )} */}
          <Deferred
            data="chartKecamatan"
            fallback={
              <div className="grid h-full w-full place-content-center text-center">
                Memuat...
              </div>
            }
          >
            {loading && (
              <div className="grid h-full w-full place-content-center text-center">
                Memuat...
              </div>
            )}

            {!loading && (
              <PieChart
                labels={chartKecamatan?.labels}
                data={chartKecamatan?.data}
              />
            )}
          </Deferred>
        </div>
        <div className="order-2 col-span-2 rounded border border-gray-300 bg-white p-6 shadow lg:order-3">
          <h2 className="mb-4 text-lg font-semibold">
            Grafik Penerimaan Tahun{" "}
            <Deferred data="year" fallback={<span>Memuat...</span>}>
              {year}
            </Deferred>
          </h2>
          <Deferred
            data="chart"
            fallback={
              <div className="grid h-full w-full place-content-center p-5 text-center">
                Memuat...
              </div>
            }
          >
            <BarChart labels={chart?.labels} data={chart?.data} />
          </Deferred>
        </div>
      </div>
    </section>
  );
};

export default DashboardPages;
