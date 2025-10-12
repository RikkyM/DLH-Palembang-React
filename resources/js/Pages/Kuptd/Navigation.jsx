import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KuptdNavigation = () => {
  const { props } = usePage();
  const { auth, inbox } = props[0];

  let data = inbox.filter(
    (i) => i.kodeKecamatan === auth.user?.uptd?.kecamatan?.kodeKecamatan,
  );

  const permohonanItems = [
    {
      label: "Wajib Retribusi",
      route: "kuptd.wajib-retribusi.index",
      activeRoute: "kuptd.wajib-retribusi.index",
    },
  ];

  const inboxItems = [
    {
      label: "Inbox Diterima",
      route: "kuptd.wajib-retribusi.diterima",
      activeRoute: [
        "kuptd.wajib-retribusi.diterima",
        "kuptd.wajib-retribusi.show",
      ],
      badge:
        data
          .filter((i) => i.status === "Processed")
          .filter((i) => i.current_role === "ROLE_KUPTD").length || "",
    },
    {
      label: "Inbox Diproses",
      route: "kuptd.wajib-retribusi.diproses",
      activeRoute: [
        "kuptd.wajib-retribusi.diproses",
        "kuptd.wajib-retribusi.show",
      ],
      badge:
        data
          .filter((i) => i.status === "Processed")
          .filter((i) => i.current_role !== "ROLE_KUPTD").length || "",
    },
    {
      label: "Inbox Ditolak",
      route: "kuptd.wajib-retribusi.ditolak",
      activeRoute: [
        "kuptd.wajib-retribusi.ditolak",
        "kuptd.wajib-retribusi.show",
      ],
      badge: data.filter((i) => i.status === "Rejected").length || "",
    },
    {
      label: "Inbox Selesai (SPKRD)",
      route: "kuptd.skrd.index",
      activeRoute: "kuptd.skrd.*",
    },
  ];

  // const tagihanItems = [
  //   {
  //     label: "Data Surat Tagihan",
  //     route: "kuptd.surat-tagihan.index",
  //   },
  // ];

  const penerimaanItems = [
    {
      label: "Data Setoran",
      route: "kuptd.data-setoran.index",
      activeRoute: ["kuptd.data-setoran.index", "kuptd.data-setoran.show"],
    },
  ];

  // const settingItems = [
  //   {
  //     label: "Uptd",
  //     // route: "super-admin.uptd",
  //   },
  //   {
  //     label: "User / Pegawai",
  //     // route: "super-admin.user",
  //   },
  //   {
  //     label: "Kecamatan",
  //   },
  //   {
  //     label: "Kelurahan",
  //   },
  //   {
  //     label: "Kategori",
  //   },
  //   {
  //     label: "Sub Kategori",
  //   },
  // ];

  const isAccordionActive = (items) =>
    items.some((item) => {
      if (item.activeRoute) {
        if (Array.isArray(item.activeRoute)) {
          return item.activeRoute.some((r) => {
            if (r === "kuptd.wajib-retribusi.show") {
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
            route().current("kuptd.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("kuptd.dashboard")}
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
        />
        {/* <AccordionItem
          title="Tagihan"
          items={tagihanItems}
          defaultOpen={isAccordionActive(tagihanItems)}
        /> */}
        <Link
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            route().current("kuptd.surat-tagihan.index")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("kuptd.surat-tagihan.index")}
        >
          Surat Tagihan
        </Link>
        <AccordionItem
          title="Penerimaan"
          items={penerimaanItems}
          defaultOpen={isAccordionActive(penerimaanItems)}
        />

        <div className="py-3">
          <Calendar />
        </div>
      </div>
    </Sidebar>
  );
};

export default KuptdNavigation;
