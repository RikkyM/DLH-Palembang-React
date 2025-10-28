import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import DropdownInput from "@/Components/DropdownInput";
import React, { useEffect } from "react";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import { useToast } from "@/Context/ToastContext";
import { roleConfig } from "@/Constants/RoleConfig";

const DialogForm = ({
  isOpen,
  onClose,
  invoice = null,
  mode = "create",
  retribusiOptions = null,
  role,
}) => {
  const { showToast } = useToast();

  const isEditMode = mode === "edit" && invoice;

  const routeConfig = roleConfig[role];

  const initialData = {
    noSkrd: "",
    namaObjekRetribusi: "",
    tarifPerbulan: "",
    jumlahBulan: "",
    satuan: "",
    // namaBank: "",
    // pengirim: "",
    // noRekening: "",
    tanggalTerbit: "",
    jatuhTempo: "",
    totalTagihan: "",
  };

  const { data, setData, errors, processing, clearErrors, post, put } =
    useForm(initialData);

  useEffect(() => {
    if (data.tarifPerbulan && data.jumlahBulan) {
      const total = data.tarifPerbulan * data.jumlahBulan;
      setData("totalTagihan", total);
    } else {
      setData("totalTagihan", "");
    }
  }, [data.tarifPerbulan, data.jumlahBulan]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && invoice?.id !== data.id) {
        setData({
          noWajibRetribusi: invoice.noWajibRetribusi,
          noSkrd: invoice.noSkrd,
          namaObjekRetribusi: invoice.skrd.namaObjekRetribusi,
          tarifPerbulan: invoice.skrd.tagihanPerBulanSkrd,
          jumlahBulan: invoice.jumlah_bulan,
          satuan: invoice.satuan,
        });
      } else {
        setData(initialData);
      }
      clearErrors();
    }
  }, [isOpen, invoice?.id, isEditMode]);

  // useEffect(() => {
  //   if (data.tanggalTerbit && data.jatuhTempo) {
  //     const start = new Date(data.tanggalTerbit);
  //     const end = new Date(data.jatuhTempo);

  //     let months =
  //       (end.getFullYear() - start.getFullYear()) * 12 +
  //       (end.getMonth() - start.getMonth());

  //     if (end.getDate() < start.getDate()) {
  //       months -= 1;
  //     }

  //     if (months < 0) months = 0;
  //     // months += 1;

  //     setData("jumlahBulan", months);
  //   } else {
  //     setData("jumlahBulan", "");
  //   }
  // }, [data.tanggalTerbit, data.jatuhTempo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    clearErrors();
    post(route(`${routeConfig}.surat-tagihan.store`), {
      onSuccess: () => {
        setData(initialData);
        showToast("Berhasil membuat nota tagihan.", "success");
        onClose();
      },
      onError: (e) => {
        showToast("Terjadi kesalahan ketika membuat nota tagihan.", "error");
      },
    });
  };

  // const retribusiList = useMemo(
  //   () =>
  //     retribusiOptions.map((r) => ({
  //       value: r.noWajibRetribusi,
  //       label: r.noSkrd,
  //     })),
  //   [retribusiOptions],
  // );

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="text-lg font-medium">Surat Tagihan</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-3 px-5 pb-5 font-poppins"
        >
          <DropdownInput
            id="noSkrd"
            label="Nomor SPKRD"
            placeholder="Pilih Nomor SPKRD..."
            value={data.noSkrd}
            onChange={(value) => {
              const selected = retribusiOptions.find(
                (opt) => opt.value === value,
              );

              setData("noSkrd", value);
              setData("namaObjekRetribusi", selected.namaObjekRetribusi);
              setData("tarifPerbulan", selected.tagihanPerbulan);
            }}
            options={retribusiOptions}
            error={errors.noSkrd}
            // value={data.noWajibRetribusi}
            // onChange={(value) => {
            //   const selected = retribusiOptions.find(
            //     (r) => r.noWajibRetribusi === value,
            //   );

            //   console.log(selected);

            //   setData("noWajibRetribusi", selected?.noWajibRetribusi || "");
            //   setData("noSkrd", selected?.noSkrd || "");
            //   setData("namaObjekRetribusi", selected?.namaObjekRetribusi || "");
            //   setData("tarifPerbulan", selected?.tagihanPerBulanSkrd || "");
            // }}
            // options={retribusiList}
            // error={errors.noWajibRetribusi}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2"
          />

          <FormInput className="col-span-2">
            <Label htmlFor="noSkrd">Nama Objek Retribusi</Label>
            <Input
              id="namaObjekRetribusi"
              value={data.namaObjekRetribusi}
              onChange={(e) => setData("namaObjekRetribusi", e.target.value)}
              readOnly={true}
              tabIndex={-1}
            />
            {errors.namaObjekRetribusi && (
              <span className="text-xs text-red-500">{errors.noSkrd}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2 md:col-span-1">
            <Label htmlFor="tarifPerbulan">Tarif Perbulan</Label>
            <Input
              id="tarifPerbulan"
              value={
                data.tarifPerbulan
                  ? new Intl.NumberFormat("id-ID").format(data.tarifPerbulan)
                  : ""
              }
              onChange={(e) => {
                setData("tarifPerbulan", e.target.value);
              }}
              readOnly={true}
            />
            {errors.tarifPerbulan && (
              <span className="text-xs text-red-500">
                {errors.tarifPerbulan}
              </span>
            )}
          </FormInput>

          <FormInput className="col-span-2 md:col-span-1">
            <Label htmlFor="jumlahBulan">Jumlah Bulan</Label>
            <Input
              id="jumlahBulan"
              type="number"
              value={data.jumlahBulan}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1 && value <= 12) {
                  setData("jumlahBulan", value);
                } else if (e.target.value === "") {
                  setData("jumlahBulan", "");
                }
              }}
              min={1}
              max={12}
              placeholder="Masukkan jumlah bulan..."
            />
            {errors.jumlahBulan && (
              <span className="text-xs text-red-500">{errors.jumlahBulan}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2">
            <Label htmlFor="totalTagihan">Jumlah</Label>
            <Input
              id="totalTagihan"
              value={
                data.totalTagihan
                  ? new Intl.NumberFormat("id-ID").format(data.totalTagihan)
                  : ""
              }
              onChange={(e) => setData("totalTagihan", e.target.value)}
              readOnly
            />
            {errors.totalTagihan && (
              <span className="text-xs text-red-500">
                {errors.totalTagihan}
              </span>
            )}
          </FormInput>

          <FormInput className="col-span-2 md:col-span-1">
            <Label htmlFor="tanggalTerbit">Tanggal Terbit</Label>
            <Input
              id="tanggalTerbit"
              type="date"
              value={data.tanggalTerbit}
              onChange={(e) => setData("tanggalTerbit", e.target.value)}
              className="w-full appearance-none"
            />
            {errors.tanggalTerbit && (
              <span className="text-xs text-red-500">
                {errors.tanggalTerbit}
              </span>
            )}
          </FormInput>
          <FormInput className="col-span-2 md:col-span-1">
            <Label htmlFor="jatuhTempo">Jatuh Tempo</Label>
            <Input
              id="jatuhTempo"
              type="date"
              value={data.jatuhTempo}
              onChange={(e) => setData("jatuhTempo", e.target.value)}
              className="w-full appearance-none"
            />
            {errors.jatuhTempo && (
              <span className="text-xs text-red-500">{errors.jatuhTempo}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2">
            <Label htmlFor="satuan">Keterangan Bulan</Label>
            <Input
              id="satuan"
              value={data.satuan}
              onChange={(e) => setData("satuan", e.target.value)}
              placeholder="contoh: Bulan (Jan s.d Des)"
            />
            {errors.satuan && (
              <span className="text-xs text-red-500">{errors.satuan}</span>
            )}
          </FormInput>
          {/* <FormInput className="col-span-2">
            <Label htmlFor="namaBank">Nama Bank</Label>
            <Input
              id="namaBank"
              value={data.namaBank}
              onChange={(e) => setData("namaBank", e.target.value)}
              placeholder="Masukkan nama bank..."
            />
            {errors.namaBank && (
              <span className="text-xs text-red-500">{errors.namaBank}</span>
            )}
          </FormInput> */}
          {/* <FormInput className="col-span-2">
            <Label htmlFor="pengirim">Nama Pengirim</Label>
            <Input
              id="pengirim"
              value={data.pengirim}
              onChange={(e) => setData("pengirim", e.target.value)}
              placeholder="Masukkan nama pengirim..."
            />
            {errors.pengirim && (
              <span className="text-xs text-red-500">{errors.pengirim}</span>
            )}
          </FormInput> */}
          {/* <FormInput className="col-span-2">
            <Label htmlFor="noRekening">No Rekening</Label>
            <Input
              id="noRekening"
              value={data.noRekening}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 15) {
                  setData("noRekening", value);
                }
              }}
              placeholder="Masukkan nomor rekening..."
            />
            {errors.noRekening && (
              <span className="text-xs text-red-500">{errors.noRekening}</span>
            )}
          </FormInput> */}

          <div className="col-span-2 flex flex-col gap-3 text-sm md:flex-row md:justify-end md:gap-2">
            <button
              className="order-1 rounded bg-teal-400 px-3 py-2 font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
              disabled={processing}
              type="submit"
            >
              {processing ? "Menyimpan..." : "Simpan Data"}
            </button>
            <button
              onClick={onClose}
              className="order-2 rounded-md border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 md:order-1"
              type="button"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default React.memo(DialogForm);
