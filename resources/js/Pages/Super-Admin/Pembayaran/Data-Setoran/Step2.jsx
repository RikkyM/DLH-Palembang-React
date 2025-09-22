import DropdownInput from "@/Components/DropdownInput";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import { useEffect } from "react";

const namaBulanID = (i) =>
  new Date(0, i).toLocaleString("id-ID", { month: "long" });

const Step2 = ({ data, setData, errors, clearErrors, previewData }) => {
  useEffect(() => {
    if (
      !Array.isArray(data.detailSetoran) ||
      data.detailSetoran.length !== 12
    ) {
      setData(
        "detailSetoran",
        Array.from({ length: 12 }, (_, i) => ({
          bulan: i,
          aktif: false,
          tanggalBayar: "",
          jumlah: "",
          keterangan: "",
        })),
      );
    }
  }, []);

  const toggleBulan = (index) => {
    const next = [...data.detailSetoran];
    if (next[index]?.locked) return;
    const aktifBaru = !next[index].aktif;
    next[index] = {
      ...next[index],
      aktif: aktifBaru,
      ...(aktifBaru ? {} : { tanggalBayar: "", jumlah: "", keterangan: "" }),
    };
    setData("detailSetoran", next);
  };

  const updateBulan = (index, field, value) => {
    const next = [...data.detailSetoran];
    if (field === "jumlah") {
      value = String(value ?? "")
        .replace(/\D/g, "")
        .replace(/^0+/, "");
    }
    next[index] = { ...next[index], [field]: value };
    setData("detailSetoran", next);
  };

  // const aktifkanSemua = () => {
  //   const next = data.detailSetoran.map((r) => ({ ...r, aktif: true }));
  //   setData("detailSetoran", next);
  // };

  // const nonaktifkanSemua = () => {
  //   const next = data.detailSetoran.map((r) => ({
  //     ...r,
  //     aktif: false,
  //     tanggalBayar: "",
  //     jumlah: "",
  //     keterangan: "",
  //   }));
  //   setData("detailSetoran", next);
  // };

  return (
    <div className="space-y-3 rounded bg-white px-3 py-5">
      <h2 className="font-semibold">Input Setoran</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="col-span-2 grid gap-5 lg:grid-cols-3">
          <DropdownInput
            id="pemohon"
            label="Metode Setor"
            placeholder="Pilih Metode Setor..."
            value={data.metodeBayar}
            onChange={(value) => {
              setData("metodeBayar", value);
              clearErrors("metodeBayar");
            }}
            options={[
              { value: "Transfer", label: "Transfer" },
              { value: "Tunai", label: "Tunai" },
              { value: "Qris", label: "Qris" },
            ]}
            error={errors.metodeBayar}
            required
            valueKey="value"
            labelKey="label"
            className="col-span-2 lg:col-span-1"
          />
          <FormInput className="col-span-2 lg:col-span-1">
            <Label
              htmlFor="namaBank"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Bank
            </Label>
            <Input
              id="namaBank"
              className={`${errors.namaBank && "border border-red-500"}`}
              placeholder="Nama Bank..."
              value={data.namaBank || ""}
              onChange={(e) => {
                setData("namaBank", e.target.value);
                clearErrors("namaBank");
              }}
            />
            {errors.namaBank && (
              <span className="text-xs text-red-500">{errors.namaBank}</span>
            )}
          </FormInput>
          <FormInput className="col-span-2 w-full lg:col-span-1">
            <Label
              htmlFor="tanggalBayar"
              className="after:text-red-500 after:content-['*']"
            >
              Tanggal Bayar
            </Label>
            <Input
              id="tanggalBayar"
              type="date"
              className={`${errors.tanggalBayar && "border border-red-500"}`}
              placeholder="Nama Bank..."
              value={data.tanggalBayar || ""}
              onChange={(e) => {
                setData("tanggalBayar", e.target.value);
                clearErrors("tanggalBayar");
              }}
            />
            {errors.tanggalBayar && (
              <span className="text-xs text-red-500">
                {errors.tanggalBayar}
              </span>
            )}
          </FormInput>
        </div>
        <div className="col-span-2 grid gap-5 lg:grid-cols-3 xl:grid-cols-5">
          <FormInput className="col-span-2 lg:col-span-1">
            <Label
              htmlFor="jumlahBayar"
              className="after:text-red-500 after:content-['*']"
            >
              Jumlah Setor
            </Label>
            <Input
              id="jumlahBayar"
              className={`${errors.jumlahBayar && "border border-red-500"}`}
              placeholder="Jumlah Bayar..."
              value={
                data.jumlahBayar
                  ? Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data.jumlahBayar)
                  : ""
              }
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                value = value.replace(/^0+/, "");

                setData("jumlahBayar", value);
                clearErrors("jumlahBayar");
              }}
            />
            {errors?.jumlahBayar ? (
              <span className="text-xs text-red-500">{errors.jumlahBayar}</span>
            ) : (
              previewData?.tarifPerbulan && (
                <span className="text-xs text-neutral-700">
                  Tarif Perbulan: {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(previewData.tarifPerbulan)}
                </span>
              )
            )}
          </FormInput>
          <FormInput className="col-span-2 lg:col-span-1">
            <Label
              htmlFor="jumlahBulanBayar"
              className="after:text-red-500 after:content-['*']"
            >
              Jumlah Bulan
            </Label>
            <Input
              id="jumlahBulanBayar"
              className={`${errors.jumlahBulanBayar && "border border-red-500"}`}
              placeholder="Jumlah Bulan Bayar..."
              pattern="^[1-9]\\d?$"
              value={data.jumlahBulanBayar || ""}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                value = value.replace(/^0+/, "");

                if (value.length > 2) value = value.slice(0, 2);
                setData("jumlahBulanBayar", value);
                clearErrors("jumlahBulanBayar");
              }}
            />
            {errors.jumlahBulanBayar && (
              <span className="text-xs text-red-500">
                {errors.jumlahBulanBayar}
              </span>
            )}
          </FormInput>
          <FormInput className="col-span-2 lg:col-span-1">
            <Label
              htmlFor="noReferensiBank"
              className="after:text-red-500 after:content-['*']"
            >
              Nomor Referensi Bank
            </Label>
            <Input
              id="noReferensiBank"
              className={`${errors.noReferensiBank && "border border-red-500"}`}
              placeholder="Nomor Referensi Bank..."
              value={data.noReferensiBank || ""}
              onChange={(e) => {
                setData("noReferensiBank", e.target.value);
                clearErrors("noReferensiBank");
              }}
            />
            {errors.noReferensiBank && (
              <span className="text-xs text-red-500">
                {errors.noReferensiBank}
              </span>
            )}
          </FormInput>
          <FormInput className="col-span-2 lg:col-span-1">
            <Label
              htmlFor="namaPengirim"
              className="after:text-red-500 after:content-['*']"
            >
              Pengirim / Penyetor
            </Label>
            <Input
              id="namaPengirim"
              className={`${errors.namaPengirim && "border border-red-500"}`}
              placeholder="Nama Pengirim..."
              value={data.namaPengirim || ""}
              onChange={(e) => {
                setData("namaPengirim", e.target.value);
                clearErrors("namaPengirim");
              }}
            />
            {errors.namaPengirim && (
              <span className="text-xs text-red-500">
                {errors.namaPengirim}
              </span>
            )}
          </FormInput>
          <FormInput className="col-span-2 lg:col-span-1">
            <Label
              htmlFor="keteranganBulan"
              className="after:text-red-500 after:content-['*']"
            >
              Keterangan Bulan
            </Label>
            <Input
              id="keteranganBulan"
              placeholder="ex. Januari s.d Des"
              className={`${errors.keteranganBulan && "border border-red-500"}`}
              value={data.keteranganBulan || ""}
              onChange={(e) => {
                setData("keteranganBulan", e.target.value);
                clearErrors("keteranganBulan");
              }}
            />
            {errors.keteranganBulan && (
              <span className="text-xs text-red-500">
                {errors.keteranganBulan}
              </span>
            )}
          </FormInput>
        </div>
        <FormInput className="col-span-2">
          <Label
            htmlFor="buktiBayar"
            className="after:text-red-500 after:content-['*']"
          >
            Bukti Bayar
          </Label>
          <Input
            id="buktiBayar"
            type="file"
            accept="image/*,application/pdf"
            className={`${errors.buktiBayar && "border border-red-500"}`}
            value={data.buktiBayar || ""}
            onChange={(e) => {
              setData("buktiBayar", e.target.files?.[0] ?? null);
              clearErrors("buktiBayar");
            }}
          />
          {errors.buktiBayar && (
            <span className="text-xs text-red-500">{errors.buktiBayar}</span>
          )}
        </FormInput>
        <div className="col-span-2">
          <div className="flex items-center justify-between p-2">
            <div className="text-sm font-semibold md:text-lg">
              <h2>Detail Input Setoran</h2>
            </div>
            {/* <div className="flex gap-2">
              <button
                type="button"
                onClick={aktifkanSemua}
                className="rounded border bg-white px-2 py-1 text-xs shadow"
              >
                Aktifkan semua
              </button>
              <button
                type="button"
                onClick={nonaktifkanSemua}
                className="rounded border bg-white px-2 py-1 text-xs shadow"
              >
                Nonaktifkan semua
              </button>
            </div> */}
          </div>

          <div className="w-full overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="*:truncate *:px-2 *:text-xs *:lg:text-sm">
                  <th>No.</th>
                  <th>Toggle</th>
                  <th className="text-left">Bulan</th>
                  <th className="text-center">Tanggal Bayar</th>
                  <th className="text-center">Jumlah Bayar</th>
                  <th className="text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => {
                  const row = data.detailSetoran?.[i] ?? {
                    aktif: false,
                    tanggalBayar: "",
                    jumlah: "",
                    keterangan: "",
                    locked: false,
                  };
                  const locked = !!row.locked;
                  const disabledInputs = locked || !row.aktif;

                  return (
                    <tr key={i} className="*:py-1.5">
                      <td className="text-center">{i + 1}</td>
                      <td className="px-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleBulan(i)}
                          disabled={locked}
                          className={`rounded border px-2 py-0.5 text-xs shadow ${
                            locked
                              ? "cursor-not-allowed border-slate-300 bg-slate-300 text-slate-600"
                              : row.aktif
                                ? "border-[#B3CEAF] bg-[#B3CEAF]/20 text-[#2b5d22]"
                                : "border-slate-300 bg-slate-200 text-slate-600"
                          }`}
                          title={
                            locked
                              ? "Sudah dibayar (terkunci)"
                              : row.aktif
                                ? "Nonaktifkan"
                                : "Aktifkan"
                          }
                        >
                          {locked ? "Sudah" : row.aktif ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>

                      <td className="pr-5 text-sm lg:text-base">
                        {namaBulanID(i)}
                      </td>

                      <td className="px-1 text-center">
                        <Input
                          type="date"
                          disabled={disabledInputs}
                          readOnly={locked}
                          value={row.tanggalBayar}
                          onChange={(e) =>
                            updateBulan(i, "tanggalBayar", e.target.value)
                          }
                          className={`w-full text-sm ${disabledInputs ? "bg-slate-200" : "bg-slate-50"}`}
                        />
                      </td>

                      <td className="px-1 text-center text-sm">
                        <Input
                          disabled={disabledInputs}
                          readOnly={locked}
                          value={
                            row.jumlah
                              ? Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(row.jumlah)
                              : ""
                          }
                          onChange={(e) => {
                            updateBulan(i, "jumlah", e.target.value);
                          }}
                          className={`w-full ${disabledInputs ? "bg-slate-200" : "bg-slate-50"}`}
                        />
                      </td>

                      <td className="px-1 text-left text-sm">
                        <Input
                          disabled={disabledInputs}
                          readOnly={locked}
                          value={row.keterangan}
                          onChange={(e) =>
                            updateBulan(i, "keterangan", e.target.value)
                          }
                          className={`w-full min-w-52 ${disabledInputs ? "bg-slate-200" : "bg-slate-50"}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {errors.detailSetoran && (
              <div className="mt-2 text-xs text-red-500">
                {errors.detailSetoran}
              </div>
            )}

            {/* Info kecil jumlah bulan aktif */}
            <div className="mt-2 text-xs text-slate-600">
              Bulan aktif:{" "}
              {data.detailSetoran?.filter?.((r) => r.aktif).length ?? 0} / 12
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
