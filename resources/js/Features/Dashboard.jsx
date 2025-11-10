import { Deferred, Head, Link, usePage } from "@inertiajs/react";
import { Clock, FileText, Users, Wallet } from "lucide-react";
import DropdownInput from "@/Components/DropdownInput";
import BarChart from "@/Components/Chart/BarChart";
import PieChart from "@/Components/Chart/PieChart";
import { roleConfig } from "@/Constants/RoleConfig";
import { useState } from "react";
import DashboardMap from "../Components/DashboardMap";
import { useProvider } from "../Context/GlobalContext";

const DashboardPages = ({
  year,
  years,
  stats,
  chart,
  chartKecamatan,
  rute,
  locations,
  yearOptions,
  kecamatanOptions = [],
  filters = [],
}) => {
  const { modalState, openModal, closeModal } = useProvider();
  const { props } = usePage();
  const { auth, announcement } = props[0];
  const { role } = auth.user;

  const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
  const [mapYear, setMapYear] = useState(filters.tahun ?? year.toString());
  const [loading, setLoading] = useState(false);

  const routeUser = roleConfig[role];

  return (
    <section className="relative min-h-screen touch-pan-y overflow-hidden p-3">
      <Head title="Dashboard" />
      <Deferred data={["years", "year"]} fallback={<p>Memuat...</p>}>
        {years?.map((y) => (
          <Link
            key={y}
            as="button"
            href={route(rute, { kecamatan, year: y })}
            preserveState
            preserveScroll
            replace
            prefetch
            cacheFor="2m"
            onStart={() => setLoading(true)}
            onFinish={() => setLoading(false)}
            only={[
              "year",
              "years",
              "stats",
              "chart",
              "chartKecamatan",
              "locations",
              "filters",
            ]}
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
              <span className="font-semibold">Jumlah SPKRD</span>
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
              <div className="flex size-9 items-center justify-center rounded-full bg-[#2BBB7A] p-2 font-medium text-white">
                {/* <DollarSign className="size-5 text-white" /> */}
                <span>Rp</span>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Penerimaan Kecamatan</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.perKecamatan) ??
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
              <div className="flex size-9 items-center justify-center rounded-full bg-[#2BBB7A] p-2 font-medium text-white">
                {/* <DollarSign className="size-5 text-white" /> */}
                <span>Rp</span>
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
              <div className="flex size-9 items-center justify-center rounded-full bg-[#2BBB7A] p-2 font-medium text-white">
                {/* <DollarSign className="size-5 text-white" /> */}
                <span>Rp</span>
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
              <div className="flex size-9 items-center justify-center rounded-full bg-[#2BBB7A] p-2 font-medium text-white">
                {/* <DollarSign className="size-5 text-white" /> */}
                <span>Rp</span>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Penerimaan UPTD P. Jawab</span>
              <span className="flex flex-wrap font-semibold text-green-600">
                <Deferred data="stats" fallback={<p>Memuat...</p>}>
                  {loading && <p>Memuat...</p>}
                  {!loading &&
                    (new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(stats?.perUptd) ??
                      0)}
                </Deferred>
              </span>
            </div>
          </div>
        </div>
        <div className="order-3 col-span-2 row-span-1 rounded border border-gray-300 bg-white px-10 py-6 shadow sm:row-span-2 lg:order-2 lg:col-span-1 lg:mt-2">
          <h2 className="mb-4 text-lg font-semibold">
            Penerimaan Retribusi{" "}
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
      <div className="mt-6 rounded border-gray-300 bg-white p-3">
        <div className="mb-3">
          <h2 className="mb-1 text-lg font-semibold md:mb-1.5">Peta Lokasi</h2>
          {role !== "ROLE_KUPTD" && role !== "ROLE_KASUBAG_TU_UPDT" && (
            <div className="flex items-center gap-2">
              <DropdownInput
                id="kecFilter"
                placeholder="Pilih Kecamatan..."
                value={kecamatan}
                onChange={(value) => setKecamatan(value)}
                options={kecamatanOptions}
                valueKey="value"
                labelKey="label"
                className="text-xs md:text-sm"
              />
              <DropdownInput
                id="thnFilter"
                placeholder="Pilih Tahun..."
                value={mapYear || year.toString()}
                onChange={(value) => setMapYear(value)}
                options={yearOptions}
                valueKey="value"
                labelKey="label"
                className="text-xs md:text-sm"
              />
              <Link
                as="button"
                href={route(`${routeUser}.dashboard`, {
                  tahun: mapYear,
                  ...(kecamatan && { kecamatan }),
                })}
                preserveScroll
                preserveState
                only={["locations", "filters"]}
                className="rounded bg-black px-3 py-2 text-xs font-medium text-white md:text-sm"
              >
                Filter
              </Link>
              {kecamatan && (
                <Link
                  as="button"
                  href={route(`${routeUser}.dashboard`)}
                  preserveScroll
                  preserveState
                  only={["locations", "filters"]}
                  onSuccess={() => {
                    setKecamatan("");
                    setMapYear(year.toString());
                  }}
                  className="rounded bg-red-500 px-3 py-2 text-xs font-medium text-white md:text-sm"
                >
                  Clear
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="h-[600px] w-full overflow-hidden border border-gray-400 shadow-lg">
          <DashboardMap locations={locations} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPages;
