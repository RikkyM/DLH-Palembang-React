import DropdownInput from "@/Components/DropdownInput";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const Step1 = ({
  data,
  setData,
  previewData,
  setPreviewData,
  errors,
  clearErrors,
  skrdOptions,
}) => {
  return (
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

            const selected = skrdOptions.find((item) => item.value === value);
            if (selected) {
              setPreviewData({
                namaObjekRetribusi: selected.namaObjekRetribusi,
                alamat: selected.alamatObjekRetribusi,
                kecamatan: selected.kecamatanObjekRetribusi,
                kelurahan: selected.kelurahanObjekRetribusi,
                tarifPerbulan: selected.tagihanPerBulanSkrd,
                tarifPertahun: selected.tagihanPerTahunSkrd,
                jumlahBulan: selected.jumlahBulan,
                keteranganBulan: selected.keteranganBulan,
              });
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
            value={previewData.namaObjekRetribusi || ""}
            tabIndex="-1"
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
              value={previewData.alamat || ""}
              tabIndex="-1"
              readOnly
            />
            {errors.alamat && (
              <span className="text-xs text-red-500">{errors.alamat}</span>
            )}
          </FormInput>
          <FormInput className="col-span-2 lg:col-span-1">
            <Label htmlFor="kecamatan">Kecamatan Objek Retribusi</Label>
            <Input
              id="kecamatan"
              className={`${errors.kecamatan && "border border-red-500"}`}
              placeholder="Kecamatan Objek Retribusi..."
              value={previewData.kecamatan || ""}
              tabIndex="-1"
              readOnly
            />
            {errors.kecamatan && (
              <span className="text-xs text-red-500">{errors.kecamatan}</span>
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
              value={previewData.kelurahan || ""}
              tabIndex="-1"
              readOnly
            />
            {errors.kelurahan && (
              <span className="text-xs text-red-500">{errors.kelurahan}</span>
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
                previewData.tarifPerbulan
                  ? new Intl.NumberFormat("id-ID").format(
                      previewData.tarifPerbulan,
                    )
                  : ""
              }
              tabIndex="-1"
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
                previewData.tarifPertahun
                  ? new Intl.NumberFormat("id-ID").format(
                      previewData.tarifPertahun,
                    )
                  : ""
              }
              tabIndex="-1"
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
              value={previewData.jumlahBulan || ""}
              tabIndex="-1"
              readOnly
            />
            {errors.jumlahBulan && (
              <span className="text-xs text-red-500">{errors.jumlahBulan}</span>
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
              value={previewData.keteranganBulan || ""}
              tabIndex="-1"
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
  );
};

export default Step1;
