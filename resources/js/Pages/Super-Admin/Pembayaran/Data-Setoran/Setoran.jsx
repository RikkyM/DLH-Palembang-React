import Layout from "../../Layout";
import { useForm } from "@inertiajs/react";
import { act, lazy, Suspense, useMemo, useState } from "react";
import { CreditCard, FileText, User } from "lucide-react";
const Step1 = lazy(() => import("./Step1"));
const Step2 = lazy(() => import("./Step2"));
const Step3 = lazy(() => import("./Step3"));

const parseIntIDR = (v) => Number(String(v ?? "").replace(/\D/g, "")) || 0;
const namaBulanID = (i) =>
  new Date(0, i).toLocaleString("id-ID", { month: "long" });

const Setoran = ({ skrdOptions = [] }) => {
  const [step, setStep] = useState(1);
  const [previewData, setPreviewData] = useState({
    namaObjekRetribusi: "",
    alamat: "",
    kecamatan: "",
    kelurahan: "",
    tarifPerbulan: "",
    tarifPerTahun: "",
    jumlahBulan: "",
    keteranganBulan: "",
  });
  const initialData = {
    noSkrd: "",
    tanggalBayar: new Date().toISOString().slice(0, 10),

    detailSetoran: Array.from({ length: 12 }, (_, i) => ({
      bulan: i,
      aktif: false,
      tanggalBayar: "",
      jumlah: "",
      keterangan: "",
      locked: false,
    })),
  };

  const {
    data,
    setData,
    errors,
    processing,
    post,
    setError,
    clearErrors,
    transform,
  } = useForm(initialData);

  const steps = useMemo(
    () => [
      { id: 1, title: "Data Existing", icon: FileText },
      { id: 2, title: "Input Pembayaran", icon: CreditCard },
      { id: 3, title: "Detail Pembayaran", icon: User },
    ],
    [],
  );

  const renderStep = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <Step1
            data={data}
            setData={setData}
            previewData={previewData}
            setPreviewData={setPreviewData}
            errors={errors}
            clearErrors={clearErrors}
            skrdOptions={skrdOptions}
          />
        );
      case 2:
        return (
          <Step2
            data={data}
            setData={setData}
            errors={errors}
            clearErrors={clearErrors}
            previewData={previewData}
          />
        );
      case 3:
        return <Step3 data={data} previewData={previewData} />;
      default:
        return null;
    }
  }, [step, data, errors, skrdOptions, setData, clearErrors]);

  const nextStep = () => {
    clearErrors();
    if (step === 1) {
      if (!data.noSkrd) {
        setError("noSkrd", "Nomor SKRD wajib diisi.");
        return;
      }
      clearErrors("noSkrd");
    }

    if (step === 2) {
      let hasError = false;

      const must = (field, msg) => {
        if (!data[field]) {
          setError(field, msg);
          hasError = true;
        } else {
          clearErrors(field);
        }
      };

      must("metodeBayar", "Metode bayar wajib dipilih.");
      must("namaBank", "Nama bank wajib diisi.");
      must("tanggalBayar", "Tanggal bayar wajib diisi.");
      must("jumlahBayar", "Jumlah bayar wajib diisi.");
      must("jumlahBulanBayar", "Jumlah bulan bayar wajib diisi.");
      must("noReferensiBank", "Nomor referensi bank wajib diisi.");
      must("namaPengirim", "Nama pengirim wajib diisi.");
      must("keteranganBulan", "Keterangan bulan wajib diisi.");
      if (!data.buktiBayar) {
        setError("buktiBayar", "Bukti bayar wajib diunggah.");
        hasError = true;
      } else {
        clearErrors("buktiBayar");
      }

      const jmlBayar = Number(String(data.jumlahBayar).replace(/\D/g, ""));
      if (isNaN(jmlBayar) || jmlBayar <= 0) {
        setError("jumlahBayar", "Jumlah bayar harus lebih dari 0.");
        hasError = true;
      }

      const jmlBulanBayar = Number(data.jumlahBulanBayar);
      if (!Number.isInteger(jmlBulanBayar) || jmlBulanBayar <= 0) {
        setError(
          "jumlahBulanBayar",
          "Jumlah bulan bayar harus bilangan bulat > 0.",
        );
        hasError = true;
      }

      if (
        previewData.jumlahBulan &&
        jmlBulanBayar > Number(previewData.jumlahBulan)
      ) {
        setError(
          "jumlahBulanBayar",
          `Maksimal ${previewData.jumlahBulan} bulan.`,
        );
        hasError = true;
      }

      if (
        previewData.tarifPertahun &&
        jmlBayar > Number(previewData.tarifPertahun)
      ) {
        setError(
          "jumlahBayar",
          `Maksimal ${Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(previewData.tarifPertahun)} tahun.`,
        );
        hasError = true;
      }

      if (
        previewData.tarifPerbulan &&
        jmlBayar < Number(previewData.tarifPerbulan)
      ) {
        setError(
          "jumlahBayar",
          `Tidak boleh kurang dari tarif perbulan ${Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(previewData.tarifPerbulan)}`,
        );
        hasError = true;
      }

      const rows = Array.isArray(data.detailSetoran) ? data.detailSetoran : [];
      const activeRows = rows.filter((r) => r && r.aktif && !r.locked);
      const lockedCount = rows.filter((r) => r && r.locked).length;
      const allowedTotal = Number(previewData.jumlahBulan || 0);

      if (allowedTotal > 0) {
        const remainingAllowed = Math.max(allowedTotal - lockedCount, 0);

        console.log(remainingAllowed, activeRows.length, allowedTotal);

        if (activeRows.length > remainingAllowed) {
          setError(
            "detailSetoran",
            `Jumlah bulan aktif (${activeRows.length}) tidak sesuai. bulan pada SPKRD (${allowedTotal} bulan), sudah dibayar (${lockedCount}) = sisa ${remainingAllowed} bulan yang harus dipilih.`,
          );
          hasError = true;
        }

        // if (
        //   remainingAllowed > 0 &&
        //   parseInt(data.jumlahBulanBayar) != activeRows.length
        // ) {
        //   setError("detailSetoran", "Minimal aktifkan 1 bulan pada tabel.");
        //   hasError = true;
        // }

        if (activeRows.length === 0 && remainingAllowed != 0) {
          setError("detailSetoran", "Minimal aktifkan 1 bulan pada tabel.");
          hasError = true;
        } else {
          clearErrors("detailSetoran");
        }
      }

      for (let i = 0; i < activeRows.length; i++) {
        const r = activeRows[i];
        const bulanName = namaBulanID(r.bulan ?? i);
        const jumlahNum = parseIntIDR(r.jumlah);
        if (!r.tanggalBayar) {
          setError(
            "detailSetoran",
            `Tanggal bayar bulan ${bulanName} wajib diisi.`,
          );
          hasError = true;
          break;
        }
        if (!(jumlahNum > 0)) {
          setError(
            "detailSetoran",
            `Jumlah bayar pada bulan ${bulanName} tidak boleh 0.`,
          );
          hasError = true;
          break;
        }
        if (jumlahNum > previewData.tarifPerbulan) {
          setError(
            "detailSetoran",
            `Jumlah bayar pada bulan ${bulanName} tidak bisa lebih dari tarif perbulan SPKRD ${Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(previewData.tarifPerbulan)}`,
          );
          hasError = true;
          break;
        }
        if (jumlahNum !== previewData.tarifPerbulan) {
          setError(
            "detailSetoran",
            `Pembayaran pada bulan ${bulanName} harus sesuai dengan tarif perbulan SPKRD ${Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(previewData.tarifPerbulan)}`,
          );
          hasError = true;
          break;
        }
      }

      const totalBulanan = activeRows.reduce(
        (acc, r) => acc + parseIntIDR(r.jumlah),
        0,
      );

      // console.log(totalBulanan, lockedCount);
      const jmlBulanInput = Number(data.jumlahBulanBayar || 0);
      const jmlBayarTotal = parseIntIDR(data.jumlahBayar || 0);

      // console.log(
      //   jmlBulanInput,
      //   jmlBayarTotal,
      //   previewData.tarifPertahun,
      //   previewData.tarifPerbulan,
      //   lockedCount,
      //   activeRows.length,
      //   lockedCount + activeRows.length,
      //   allowedTotal
      // );

      if (jmlBayarTotal != jmlBulanInput * previewData.tarifPerbulan) {
        setError(
          "jumlahBayar",
          `Jumlah setor tidak sesuai dengan jumlah bulan ${Intl.NumberFormat(
            "id-ID",
            {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            },
          ).format(previewData.tarifPerbulan)}`,
        );
        hasError = true;
      }

      if (jmlBayarTotal > previewData.tarifPertahun) {
        setError(
          "jumlahBayar",
          `Jumlah setor tidak boleh lebih dari tarif pertahun (${Intl.NumberFormat(
            "id-ID",
            {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            },
          ).format(previewData.tarifPertahun)})`,
        );
        hasError = true;
      }

      if (data.jumlahBulanBayar > previewData.jumlahBulan) {
        setError(
          "jumlahBulanBayar",
          `Jumlah bulan tidak boleh melebihi jumlah bulan dari SPKRD (${previewData.jumlahBulan} Bulan)`,
        );
        hasError = true;
      }

      // if (activeRows.length !== jmlBulanInput) {
      //   setError(
      //     "jumlahBulanBayar",
      //     `Jumlah Bulan Bayar (${jmlBulanInput}) harus sama dengan baris aktif (${activeRows.length}).`,
      //   );
      //   setError(
      //     "detailSetoran",
      //     "Periksa kembali jumlah baris aktif pada tabel.",
      //   );
      //   hasError = true;
      // } else {
      //   clearErrors("jumlahBulanBayar");
      // }

      // if (totalBulanan !== jmlBayarTotal) {
      //   const fmt = (n) =>
      //     Intl.NumberFormat("id-ID", {
      //       style: "currency",
      //       currency: "IDR",
      //       minimumFractionDigits: 0,
      //     }).format(n);

      //   setError(
      //     "jumlahBayar",
      //     `Total per-bulan (${fmt(totalBulanan)}) harus sama dengan Jumlah Bayar (${fmt(jmlBayarTotal)}).`,
      //   );
      //   setError(
      //     "detailSetoran",
      //     "Total pada tabel tidak sesuai dengan Jumlah Bayar.",
      //   );
      //   hasError = true;
      // } else {
      //   clearErrors("jumlahBayar");
      // }

      if (hasError) return;
    }

    if (step < 3) setStep((s) => s + 1);
  };

  const prevStep = () => {
    clearErrors();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const namaBulanID = (i) =>
      new Date(0, i).toLocaleString("id-ID", { month: "long" });

    const filledRows = (data.detailSetoran ?? [])
      .filter((r) => r.aktif && (r.tanggalBayar || r.jumlah || r.keterangan))
      .map((r) => ({
        bulan: namaBulanID(r.bulan),
        tanggalBayar: r.tanggalBayar,
        jumlah: r.jumlah ? Number(String(r.jumlah).replace(/\D/g, "")) : 0,
        keterangan: r.keterangan?.trim() || null,
      }))
      .filter((r) => r.jumlah > 0 || r.tanggalBayar || r.keterangan);

    transform((d) => ({
      ...d,
      detailSetoran: filledRows,
    }));

    post(route("super-admin.data-setoran.store"), {
      onSuccess: () => {
        setStep(1);
        setData(initialData);
        setPreviewData({
          noSkrd: "",
          noWajibRetribusi: "",
          namaObjekRetribusi: "",
          alamat: "",
          kecamatan: "",
          kelurahan: "",
          tarifPerbulan: "",
          tarifPerTahun: "",
          jumlahBulan: "",
          keteranganBulan: "",
        });
      },
      onError: (e) => {
        console.log("Terjadi kesalahan ketika menyimpan data.");
      },
    });
  };

  return (
    <Layout title="Input Setoran">
      <form
        onSubmit={handleSubmit}
        className="h-[calc(100dvh_-_80px)] touch-pan-y space-y-3 overflow-auto p-3"
        noValidate
      >
        <div className="flex w-full items-center justify-center overflow-x-auto rounded border bg-white px-3 py-5 shadow">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isActive = step === stepItem.id;
            const isCompleted = step > stepItem.id;

            return (
              <div key={stepItem.id} className="flex items-center">
                <div
                  className={`${isActive && "text-[#B3CEAF]"} ${isCompleted && "text-[#B3CEAF]"} ${!isActive && !isCompleted && "text-slate-500"}`}
                >
                  <Icon className="size-6" />
                </div>
                <div className="ml-2 hidden lg:inline-block">
                  <p
                    className={`text-xs font-medium ${isActive && "text-[#B3CEAF]"} ${isCompleted && "text-[#B3CEAF]"} ${!isActive && !isCompleted && "text-slate-500"}`}
                  >
                    {stepItem.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-14 ${isCompleted ? "bg-[#B3CEAF]" : "bg-slate-500"}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        <Suspense fallback={<div>Memuat...</div>}>{renderStep}</Suspense>

        <div className="sticky bottom-0 flex justify-between border bg-white p-2 font-semibold shadow">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="rounded border bg-white px-3 py-1.5 text-sm shadow disabled:text-slate-500"
          >
            Sebelumnya
          </button>
          <div className="flex gap-2">
            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="rounded border bg-white px-3 py-1.5 text-sm shadow"
              >
                Selanjutnya
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="rounded border bg-white px-3 py-1.5 text-sm shadow"
              >
                {processing ? "Menyimpan..." : "Simpan Data"}
              </button>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Setoran;
