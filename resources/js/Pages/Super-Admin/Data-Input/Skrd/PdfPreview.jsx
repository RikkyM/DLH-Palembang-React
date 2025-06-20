import { FileText, ArrowLeft, Download } from "lucide-react";
import { router } from "@inertiajs/react";

const PdfPreview = ({ data }) => {
    const handleDownloadPdf = () => {
        window.print();
    };

    const handleBack = () => {
        router.get(route("super-admin.skrd.index"));
    };

    return (
        <>
            <section className="p-3">
                <div
                    id="header"
                    className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow print-hidden"
                >
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Kembali
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownloadPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        >
                            <Download size={20} />
                            Download PDF
                        </button>
                    </div>
                </div>

                <div
                    id="frame"
                    className="max-w-4xl mx-auto border border-black p-2 print:border-none print:px-0"
                >
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        textAlign: "center",
                                        width: "50%",
                                        verticalAlign: "top",
                                    }}
                                >
                                    <img
                                        src="/img/logo_palembang.png"
                                        alt="logo"
                                        width={120}
                                        style={{ margin: "auto" }}
                                    />
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                        }}
                                    >
                                        PEMERINTAH KOTA PALEMBANG
                                        <br />
                                        DINAS LINGKUNGAN HIDUP
                                    </span>
                                    <br />
                                    <p style={{ fontSize: "12px" }}>
                                        JALAN SUKARELA No.129 A KM 7 TELP (0711)
                                        415130
                                        <br />
                                    </p>
                                    <p style={{ fontSize: "12px" }}>
                                        PALEMBANG
                                    </p>
                                </td>
                                <td
                                    style={{
                                        width: "50%",
                                        verticalAlign: "top",
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Surat Pemberitahuan Ketetapan Retribusi
                                        Daerah
                                    </h2>
                                    <h2
                                        style={{
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            textAlign: "center",
                                        }}
                                    >
                                        (Aneka Retribusi Kebersihan)
                                    </h2>
                                    <p className="text-xs">Dasar:</p>
                                    <div className="pl-8 text-xs leading-6 mb-2">
                                        <p>
                                            Peraturan Daerah Kota Palembang No.
                                            27 Tahun 2011
                                        </p>
                                        <p>
                                            Surat keputusan kepala DLHK Kota
                                            Palembang
                                        </p>
                                        <p>No : </p>
                                        <p>Tanggal/Tahun : </p>
                                        <p>
                                            Tentang: Surat Ketetapan Retribusi
                                            Daerah Tahun 2023
                                        </p>
                                        <p>(Aneka Retribusi Kebersihan)</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th colSpan={3}></th>
                                <th
                                    colSpan={2}
                                    className="text-xs font-normal w-1/2"
                                >
                                    Lampiran :
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <table className="w-full border border-black divide-y divide-black">
                        <thead>
                            <tr className="divide-x divide-black">
                                <th
                                    colSpan={3}
                                    className="text-xs font-normal w-1/2"
                                >
                                    Letak Wajib Retribusi
                                </th>
                                <th
                                    colSpan={2}
                                    className="text-xs font-normal w-1/2"
                                >
                                    Nama dan Alamat Wajib Retribusi Kebersihan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="h-24 divide-x divide-black">
                                <td colSpan={3} className="text-xs px-2">
                                    <p>
                                        Kecamatan:{" "}
                                        {data.kecamatanObjekRetribusi}
                                    </p>
                                    <p>
                                        Kelurahan:{" "}
                                        {data.kelurahanObjekRetribusi}
                                    </p>
                                </td>
                                <td colSpan={2} className="text-xs px-2"></td>
                            </tr>
                            <tr className="divide-x divide-black text-xs">
                                <td className="text-center border border-black p-0.5">
                                    No. Reg
                                </td>
                                <td className="text-center border border-black p-0.5">
                                    Objek Retribusi
                                </td>
                                <td className="text-center border border-black p-0.5">
                                    Kelas
                                </td>
                                <td className="text-center border border-black p-0.5">
                                    Tarif / Bulan
                                </td>
                                <td className="text-center border border-black p-0.5">
                                    Tarif / Tahun
                                </td>
                            </tr>
                            <tr className="divide-x border-b border-black divide-black text-[10px]">
                                <td colSpan={3} className="p-2">
                                    Objek Retribusi yang harus dibayar/bulan:{" "}
                                    {data.tarifPerBulanObjekRetribusi}
                                </td>
                                <td colSpan={2} className="p-2">
                                    Terbilang: {data.terbilangBulan}
                                </td>
                            </tr>
                            <tr className="divide-x divide-black text-[10px]">
                                <td colSpan={3} className="p-2">
                                    Objek Retribusi yang harus dibayar/tahun:{" "}
                                    {data.tarifPerBulanObjekRetribusi}
                                </td>
                                <td colSpan={2} className="p-2">
                                    Terbilang: {data.terbilangTahun}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="text-center text-xs font-semibold w-1/2">
                                    SKET LOKASI
                                </td>
                                <td className="w-1/2"></td>
                            </tr>
                            <tr>
                                <td className="w-1/2">
                                    <iframe
                                        name="maps"
                                        src={`//maps.google.com/maps?q=${data.latitudeObjekRetribusi},${data.longitudeObjekRetribusi}&z=15&output=embed&z=18`}
                                        height="270"
                                        loading="lazy"
                                        className="border border-black p-0.5 pointer-events-none w-full"
                                    />
                                </td>
                                <td className="w-1/2 align-middle text-center text-xs">
                                    <div className="leading-5">
                                        <p>A/n Kepala Dinas Lingkungan Hidup</p>
                                        <p>dan Kebersihan Kota Palembang</p>
                                        <p>Sekretaris,</p>
                                    </div>
                                    <img
                                        src="/img/qrcode.jpg"
                                        alt="QR Code DLH Palembang"
                                        width={50}
                                        height={50}
                                        className="mx-auto my-2"
                                    />
                                    <div className="leading-5">
                                        <p>
                                            Aris Satria Bandarnata, S.STP., M.Si
                                        </p>
                                        <p>NIP 1674021843992034</p>
                                    </div>
                                    <div className="text-left px-5 text-[7px] leading-relaxed text-pretty">
                                        UU ITE No. 11 Tahun 2008 Pasal 5 ayat 1
                                        Informasi Elektronik dan/atau Dokumen
                                        Elektronik dan/atau hasil cetaknya
                                        merupakan alat bukti hukum yang sah. -
                                        Dokumen ini telah ditandatangani secara
                                        elektronik menggunakan sertifikat
                                        elektronik yang diterbitkan BSrE. -
                                        Surat ini dapat dibuktikan keasliannya
                                        dengan cara memindai QRCode yang
                                        terdapat pada lembar ini dengan
                                        menggunakan aplikasi Sidemang atau
                                        VeryDS, dapat diunduh melalui
                                        Playstore/Appstore.
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default PdfPreview;
