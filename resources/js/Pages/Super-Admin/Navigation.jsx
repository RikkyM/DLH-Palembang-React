import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const SuperAdminNavigation = () => {
  const { props } = usePage();
  const { inbox } = props[0];

  const permohonanItems = [
    {
      label: "Pemohon",
      route: "super-admin.pemohon.index",
    },
    {
      label: "Wajib Retribusi",
      route: "super-admin.wajib-retribusi.index",
      activeRoute: [
        "super-admin.wajib-retribusi.index",
        "super-admin.wajib-retribusi.create",
      ],
    },
  ];

  const inboxItems = [
    {
      label: "Inbox Diterima",
      route: "super-admin.wajib-retribusi.diterima",
      activeRoute: [
        "super-admin.wajib-retribusi.diterima",
        "super-admin.wajib-retribusi.show",
      ],
      badge:
        inbox
          .filter((i) => i.status == "Approved")
          .filter((i) => i.current_role === "ROLE_PENDAFTAR").length || "",
    },
    {
      label: "Inbox Diproses",
      route: "super-admin.wajib-retribusi.diproses",
      activeRoute: [
        "super-admin.wajib-retribusi.diproses",
        "super-admin.wajib-retribusi.show",
      ],
      badge:
        inbox
          .filter((i) => i.status === "Processed")
          .filter((i) => i.current_role !== "ROLE_PENDAFTAR").length || "",
    },
    {
      label: "Inbox Ditolak",
      route: "super-admin.wajib-retribusi.ditolak",
      activeRoute: [
        "super-admin.wajib-retribusi.ditolak",
        "super-admin.wajib-retribusi.show",
      ],
      badge: inbox.filter((i) => i.status === "Rejected").length || "",
    },
    {
      label: "Inbox Selesai (SPKRD)",
      route: "super-admin.skrd.index",
      activeRoute: "super-admin.skrd.*",
    },
  ];

  const tagihanItems = [
    // {
    //   label: "Surat Tagihan",
    //   // route: "super-admin.invoice.index",
    // },
    {
      label: "Data Surat Tagihan",
      route: "super-admin.surat-tagihan.index",
    },
    // {
    //   label: "History Setoran",
    //   // route: "super-admin.laporan.piutang-retribusi",
    // },
    // {
    //   label: "Penerimaan Retribusi",
    //   route: "super-admin.penerimaan-retribusi.index",
    // },
    // {
    //   label: "Piutang Retribusi",
    //   // route: "super-admin.laporan.piutang-retribusi",
    // },
  ];

  const penerimaanItems = [
    // {
    //   label: "Input Setoran",
    //   route: "super-admin.input-setoran",
    // },
    {
      label: "Data Setoran",
      route: "super-admin.data-setoran.index",
      activeRoute: [
        "super-admin.data-setoran.index",
        "super-admin.data-setoran.show",
      ],
    },
    // {
    //   label: "Detail Setoran",
    //   // route: "super-admin.laporan.piutang-retribusi",
    // },
  ];

  // const pembayaranItems = [
  //   {
  //     label: "Invoice",
  //     route: "super-admin.invoice.index",
  //   },
  //   {
  //     label: "Input Setoran",
  //     route: "super-admin.input-setoran",
  //   },
  //   {
  //     label: "History Setoran",
  //     // route: "super-admin.laporan.piutang-retribusi",
  //   },
  //   {
  //     label: "Penerimaan Retribusi",
  //     route: "super-admin.penerimaan-retribusi.index",
  //   },
  //   {
  //     label: "Piutang Retribusi",
  //     // route: "super-admin.laporan.piutang-retribusi",
  //   },
  // ];

  const rekapitulasiItems = [
    {
      label: "Pemohon",
      // route: "super-admin.laporan.piutang-retribusi",
    },
    {
      label: "Wajib Retribusi",
      // route: "super-admin.laporan.penerimaan-retribusi",
    },
    {
      label: "SPKRD",
      route: "super-admin.rekapitulasi.spkrd",
    },
    {
      label: "Penerimaan",
      // route: "super-admin.laporan.piutang-retribusi",
    },
    {
      label: "Piutang",
      // route: "super-admin.laporan.piutang-retribusi",
    },
  ];

  const masterData = [
    {
      label: "Data Uptd",
      route: "super-admin.uptd.index",
    },
    {
      label: "Data User / Pegawai",
      route: "super-admin.user.index",
    },
    {
      label: "Data Penagih / Kolektor",
      route: "super-admin.penagih.index",
    },
    {
      label: "Data Kecamatan",
      route: "super-admin.kecamatan.index",
    },
    {
      label: "Data Kelurahan",
      route: "super-admin.kelurahan.index",
    },
    {
      label: "Data Kategori Layanan",
      route: "super-admin.kategori.index",
    },
    {
      label: "Data Sub Kategori Layanan",
      route: "super-admin.sub-kategori.index",
    },
    {
      label: "Badan Usaha",
      route: "super-admin.badan-usaha.index",
    },
  ];

  const settingItems = [
    {
      label: "Penanda Tangan",
      // route: "super-admin.uptd.index",
    },
    {
      label: "Data Instansi",
      // route: "super-admin.user.index",
    },
    {
      label: "Informasi",
      // route: "super-admin.kecamatan.index",
    },
  ];

  const isAccordionActive = (items) =>
    items.some((item) => {
      if (item.activeRoute) {
        if (Array.isArray(item.activeRoute)) {
          return item.activeRoute.some((r) => {
            if (r === "super-admin.wajib-retribusi.show") {
              const params = route().params;
              if (
                item.label.toLowerCase().includes("diterima") &&
                params.status === "diterima"
              ) {
                return route().current(r);
              }
              if (
                item.label.toLowerCase().includes("diproses") &&
                params.status === "diproses"
              ) {
                return route().current(r);
              }
              if (
                item.label.toLowerCase().includes("ditolak") &&
                params.status === "ditolak"
              ) {
                return route().current(r);
              }
              return false;
            }
            return route().current(r);
          });
        }
        return route().current(item.activeRoute);
      }
      return item.route ? route().current(item.route) : false;
    });

  return (
    <Sidebar>
      <div className="space-y-1.5 p-3">
        <Link
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            route().current("super-admin.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("super-admin.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Permohonan"
          items={permohonanItems}
          defaultOpen={isAccordionActive(permohonanItems)}
        />
        <AccordionItem
          title="Inbox Data"
          items={inboxItems}
          defaultOpen={isAccordionActive(inboxItems)}
          badge="diterima"
        />
        <AccordionItem
          title="Tagihan"
          items={tagihanItems}
          defaultOpen={isAccordionActive(tagihanItems)}
        />
        <AccordionItem
          title="Penerimaan"
          items={penerimaanItems}
          defaultOpen={isAccordionActive(penerimaanItems)}
        />
        {/* <AccordionItem
          title="Pembayaran"
          items={pembayaranItems}
          defaultOpen={isAccordionActive(pembayaranItems)}
        /> */}
        <AccordionItem
          title="Rekapitulasi Data"
          items={rekapitulasiItems}
          defaultOpen={isAccordionActive(rekapitulasiItems)}
        />
        <AccordionItem
          title="Master Data"
          items={masterData}
          defaultOpen={isAccordionActive(masterData)}
        />
        <AccordionItem
          title="Setting"
          items={settingItems}
          defaultOpen={isAccordionActive(settingItems)}
        />
        <div className="py-3">
          <Calendar className="border-none" />
        </div>
      </div>
    </Sidebar>
  );
};

export default SuperAdminNavigation;
