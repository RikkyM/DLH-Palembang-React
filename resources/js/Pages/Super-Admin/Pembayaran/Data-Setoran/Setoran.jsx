import Layout from "../../Layout";
import DropdownInput from "@/Components/DropdownInput";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { CloudCog, CreditCard, FileText, User } from "lucide-react";

const Setoran = ({ skrdOptions = [] }) => {
  const [step, setStep] = useState(1);
  const initialData = {
    noSkrd: "",
    namaObjekRetribusi: "",
    alamat: "",
    kecamatan: "",
    kelurahan: "",
    tarifPerbulan: "",
    tarifPerTahun: "",
    jumlahBulan: "",
    keteranganBulan: "",

    // namaBank: "",
     tanggalBayar: new Date().toISOString().slice(0, 10),
  };

  const { data, setData, errors, post, setError, clearErrors } =
    useForm(initialData);

  const steps = [
    { id: 1, title: "Data Existing", icon: FileText },
    { id: 2, title: "Input Pembayaran", icon: CreditCard },
    { id: 3, title: "Detail Pembayaran", icon: User },
  ];

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
      must("keteranganBulanInput", "Keterangan bulan wajib diisi.");
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

      if (data.jumlahBulan && jmlBulanBayar > Number(data.jumlahBulan)) {
        setError("jumlahBulanBayar", `Maksimal ${data.jumlahBulan} bulan.`);
        hasError = true;
      }

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

    console.log(step);
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
                    className={`mx-4 h-0.5 w-16 ${isCompleted ? "bg-[#B3CEAF]" : "bg-slate-500"}`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="space-y-3 rounded bg-white px-3 py-5">
            <h2 className="font-semibold">Pilih Data Existing</h2>
            <div className="grid w-full gap-3 md:grid-cols-2">
              <DropdownInput
                id="noSkrd"
                label="Pilih Nomor SKRD"
                placeholder="Silahkan Pilih Nomor SKRD..."
                value={data.noSkrd}
                onChange={(value) => {
                  clearErrors();
                  setData("noSkrd", value);

                  const selected = skrdOptions.find(
                    (item) => item.value === value,
                  );
                  if (selected) {
                    setData("namaObjekRetribusi", selected.namaObjekRetribusi);
                    setData("alamat", selected.alamatObjekRetribusi);
                    setData("kecamatan", selected.kecamatanObjekRetribusi);
                    setData("kelurahan", selected.kelurahanObjekRetribusi);
                    setData("tarifPerbulan", selected.tagihanPerBulanSkrd);
                    setData("tarifPertahun", selected.tagihanPerTahunSkrd);
                    setData("jumlahBulan", selected.jumlahBulan);
                    setData("keteranganBulan", selected.keteranganBulan);
                  }
                }}
                options={skrdOptions}
                error={errors.noSkrd}
                required
                valueKey="value"
                labelKey="label"
                className="col-span-2 lg:col-span-1"
              />
              <FormInput className="col-span-2 lg:col-span-1">
                <Label htmlFor="namaObjekRetribusi">Nama Objek Retribusi</Label>
                <Input
                  id="namaObjekRetribusi"
                  className={`${errors.namaObjekRetribusi && "border border-red-500"}`}
                  placeholder="Nama Objek Retribusi..."
                  value={data.namaObjekRetribusi || ""}
                  onChange={(e) =>
                    setData("namaObjekRetribusi", e.target.value)
                  }
                  readOnly
                />
                {errors.namaObjekRetribusi && (
                  <span className="text-xs text-red-500">
                    {errors.namaObjekRetribusi}
                  </span>
                )}
              </FormInput>
              <div className="col-span-2 grid gap-3 lg:grid-cols-3">
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label htmlFor="alamat">Alamat Objek Retribusi</Label>
                  <Input
                    id="alamat"
                    className={`${errors.alamat && "border border-red-500"}`}
                    placeholder="Alamat Objek Retribusi..."
                    value={data.alamat || ""}
                    onChange={(e) => setData("alamat", e.target.value)}
                    readOnly
                  />
                  {errors.alamat && (
                    <span className="text-xs text-red-500">
                      {errors.alamat}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label htmlFor="kecamatan">Kecamatan Objek Retribusi</Label>
                  <Input
                    id="kecamatan"
                    className={`${errors.kecamatan && "border border-red-500"}`}
                    placeholder="Kecamatan Objek Retribusi..."
                    value={data.kecamatan || ""}
                    onChange={(e) => setData("kecamatan", e.target.value)}
                    readOnly
                  />
                  {errors.kecamatan && (
                    <span className="text-xs text-red-500">
                      {errors.kecamatan}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="kelurahan"
                    // className="after:text-red-500 after:content-['*']"
                  >
                    Kelurahan Objek Retribusi
                  </Label>
                  <Input
                    id="kelurahan"
                    className={`${errors.kelurahan && "border border-red-500"}`}
                    placeholder="Kelurahan Objek Retribusi..."
                    value={data.kelurahan || ""}
                    onChange={(e) => setData("kelurahan", e.target.value)}
                    readOnly
                  />
                  {errors.kelurahan && (
                    <span className="text-xs text-red-500">
                      {errors.kelurahan}
                    </span>
                  )}
                </FormInput>
              </div>
              <div className="col-span-2 grid gap-5 lg:grid-cols-4">
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="tarifPerbulan"
                    // className="after:text-red-500 after:content-['*']"
                  >
                    Tarif Perbulan
                  </Label>
                  <Input
                    id="tarifPerbulan"
                    className={`${errors.tarifPerbulan && "border border-red-500"}`}
                    placeholder="Tarif Perbulan..."
                    value={
                      data.tarifPerbulan
                        ? new Intl.NumberFormat("id-ID").format(
                            data.tarifPerbulan,
                          )
                        : ""
                    }
                    onChange={(e) => setData("tarifPerbulan", e.target.value)}
                    readOnly
                  />
                  {errors.tarifPerbulan && (
                    <span className="text-xs text-red-500">
                      {errors.tarifPerbulan}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="tarifPertahun"
                    // className="after:text-red-500 after:content-['*']"
                  >
                    Tarif Pertahun
                  </Label>
                  <Input
                    id="tarifPertahun"
                    className={`${errors.tarifPertahun && "border border-red-500"}`}
                    placeholder="Tarif Pertahun..."
                    value={
                      data.tarifPertahun
                        ? new Intl.NumberFormat("id-ID").format(
                            data.tarifPertahun,
                          )
                        : ""
                    }
                    onChange={(e) => setData("tarifPertahun", e.target.value)}
                    readOnly
                  />
                  {errors.tarifPertahun && (
                    <span className="text-xs text-red-500">
                      {errors.tarifPertahun}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="jumlahBulan"
                    // className="after:text-red-500 after:content-['*']"
                  >
                    Jumlah Bulan
                  </Label>
                  <Input
                    id="jumlahBulan"
                    className={`${errors.jumlahBulan && "border border-red-500"}`}
                    placeholder="Tarif Pertahun..."
                    value={data.jumlahBulan || ""}
                    onChange={(e) => setData("jumlahBulan", e.target.value)}
                    readOnly
                  />
                  {errors.jumlahBulan && (
                    <span className="text-xs text-red-500">
                      {errors.jumlahBulan}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="keteranganBulan"
                    // className="after:text-red-500 after:content-['*']"
                  >
                    Keterangan Bulan
                  </Label>
                  <Input
                    id="keteranganBulan"
                    className={`${errors.keteranganBulan && "border border-red-500"}`}
                    placeholder="Keterangan Bulan..."
                    value={data.keteranganBulan || ""}
                    onChange={(e) => setData("keteranganBulan", e.target.value)}
                    readOnly
                  />
                  {errors.keteranganBulan && (
                    <span className="text-xs text-red-500">
                      {errors.keteranganBulan}
                    </span>
                  )}
                </FormInput>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 rounded bg-white px-3 py-5">
            <h2 className="font-semibold">Input Pembayaran</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="col-span-2 grid gap-5 lg:grid-cols-3">
                <DropdownInput
                  id="pemohon"
                  label="Metode Bayar"
                  placeholder="Silahkan Metode Bayar..."
                  value={data.metodeBayar}
                  onChange={(value) => {
                    setData("metodeBayar", value);
                    clearErrors("metodeBayar");
                  }}
                  options={[
                    { value: "Transfer", label: "Transfer" },
                    { value: "Cash", label: "Cash" },
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
                    <span className="text-xs text-red-500">
                      {errors.namaBank}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
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
                    value={
                      data.tanggalBayar || ""
                    }
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
                    Jumlah Bayar
                  </Label>
                  <Input
                    id="jumlahBayar"
                    className={`${errors.jumlahBayar && "border border-red-500"}`}
                    placeholder="Jumlah Bayar..."
                    value={data.jumlahBayar || ""}
                    onChange={(e) => {
                      setData("jumlahBayar", e.target.value.replace(/\D/g, ""));
                      clearErrors("jumlahBayar");
                    }}
                  />
                  {errors.jumlahBayar && (
                    <span className="text-xs text-red-500">
                      {errors.jumlahBayar}
                    </span>
                  )}
                </FormInput>
                <FormInput className="col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="jumlahBulanBayar"
                    className="after:text-red-500 after:content-['*']"
                  >
                    Jumlah Bulan Bayar
                  </Label>
                  <Input
                    id="jumlahBulanBayar"
                    className={`${errors.jumlahBulanBayar && "border border-red-500"}`}
                    placeholder="Jumlah Bulan Bayar..."
                    value={data.jumlahBulanBayar || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      if (value.length <= 2) {
                        setData("jumlahBulanBayar", value);
                        clearErrors("jumlahBulanBayar");
                      }
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
                    Nama Pengirim / Penyetor
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
                    htmlFor="keteranganBulanInput"
                    className="after:text-red-500 after:content-['*']"
                  >
                    Keterangan Bulan
                  </Label>
                  <Input
                    id="keteranganBulanInput"
                    placeholder="Keterangan Bulan..."
                    className={`${errors.keteranganBulanInput && "border border-red-500"}`}
                    value={data.keteranganBulanInput || ""}
                    onChange={(e) => {
                      setData("keteranganBulanInput", e.target.value);
                      clearErrors("keteranganBulanInput");
                    }}
                  />
                  {errors.keteranganBulanInput && (
                    <span className="text-xs text-red-500">
                      {errors.keteranganBulanInput}
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
                    setData("buktiBayar", e.target.value);
                    clearErrors("buktiBayar");
                  }}
                />
                {errors.buktiBayar && (
                  <span className="text-xs text-red-500">
                    {errors.buktiBayar}
                  </span>
                )}
              </FormInput>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 rounded bg-white px-3 py-5">
            Sedang Dikerjakan
            <br />
            <a
              href="https://v0.app/chat/ui-modernization-advice-gTN8dJzUkJ3?b=v0-preview-b_PIDp1h0nMJh&f=1&path=%2F"
              target="_blank"
              className="font-semibold text-blue-400 transition-colors duration-500 hover:text-blue-700"
            >
              Klik Disini Contoh Tampilannya
            </a>
          </div>
        )}

        <div className="flex justify-between font-semibold">
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
                Simpan Data
              </button>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Setoran;
