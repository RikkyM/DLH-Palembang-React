import Layout from "../../Layout";
import DropdownInput from "@/Components/DropdownInput";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import { useForm } from "@inertiajs/react";

const Setoran = ({ skrdOptions = [] }) => {
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
  };

  console.log(skrdOptions);

  const { data, setData, errors, post } = useForm(initialData);

  return (
    <Layout title="Input Setoran">
      <form onSubmit={null} className="grid touch-pan-y grid-cols-2 gap-3 p-3">
      <div className="col-span-2">
        Pilih Data Existing
      </div>
        <DropdownInput
          id="noSkrd"
          label="Pilih Nomor SKRD"
          placeholder="Silahkan Pilih Nomor SKRD..."
          value={data.noSkrd}
          onChange={(value) => {
            setData("noSkrd", value);

            const selected = skrdOptions.find((item) => item.value === value);
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
          error={errors.pemilikId}
          required={true}
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
              handleInputChange("namaObjekRetribusi", e.target.value)
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
              onChange={(e) => handleInputChange("alamat", e.target.value)}
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
              value={data.kecamatan || ""}
              onChange={(e) => handleInputChange("kecamatan", e.target.value)}
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
              value={data.kelurahan || ""}
              onChange={(e) => handleInputChange("kelurahan", e.target.value)}
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
                data.tarifPerbulan
                  ? new Intl.NumberFormat("id-ID").format(data.tarifPerbulan)
                  : ""
              }
              onChange={(e) =>
                handleInputChange("tarifPerbulan", e.target.value)
              }
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
                  ? new Intl.NumberFormat("id-ID").format(data.tarifPertahun)
                  : ""
              }
              onChange={(e) =>
                handleInputChange("tarifPertahun", e.target.value)
              }
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
              onChange={(e) => handleInputChange("jumlahBulan", e.target.value)}
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
              value={data.keteranganBulan || ""}
              onChange={(e) =>
                handleInputChange("keteranganBulan", e.target.value)
              }
              readOnly
            />
            {errors.keteranganBulan && (
              <span className="text-xs text-red-500">
                {errors.keteranganBulan}
              </span>
            )}
          </FormInput>
        </div>
        <div className="col-span-2 border border-black"></div>
        <div className="">Input Pembayaran</div>
        <div className="col-span-2 grid gap-5 lg:grid-cols-3">
          <DropdownInput
            id="pemohon"
            label="Metode Bayar"
            placeholder="Silahkan Metode Bayar..."
            // value={data.pemilikId}
            // onChange={(value) => handleInputChange("pemilikId", value)}
            // options={pemohonOptions}
            // error={errors.pemilikId}
            // required={true}
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
              onChange={(e) => handleInputChange("namaBank", e.target.value)}
            />
            {errors.namaBank && (
              <span className="text-xs text-red-500">{errors.namaBank}</span>
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
              value={data.tanggalBayar || new Date()}
              onChange={(e) =>
                handleInputChange("tanggalBayar", e.target.value)
              }
            />
            {errors.tanggalBayar && (
              <span className="text-xs text-red-500">
                {errors.tanggalBayar}
              </span>
            )}
          </FormInput>
        </div>
        <div className="col-span-2 grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
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
              onChange={(e) => handleInputChange("jumlahBayar", e.target.value)}
            />
            {errors.jumlahBayar && (
              <span className="text-xs text-red-500">{errors.jumlahBayar}</span>
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
              onChange={(e) =>
                handleInputChange("jumlahBulanBayar", e.target.value)
              }
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
              onChange={(e) =>
                handleInputChange("noReferensiBank", e.target.value)
              }
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
              onChange={(e) =>
                handleInputChange("namaPengirim", e.target.value)
              }
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
              placeholder="Keterangan Bulan..."
              className={`${errors.keteranganBulan && "border border-red-500"}`}
              value={data.keteranganBulan || ""}
              onChange={(e) =>
                handleInputChange("keteranganBulan", e.target.value)
              }
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
            onChange={(e) => handleInputChange("buktiBayar", e.target.value)}
          />
          {errors.buktiBayar && (
            <span className="text-xs text-red-500">{errors.buktiBayar}</span>
          )}
        </FormInput>

        {/* <div className="col-span-2 border border-black"></div>
        <div className="col-span-2 w-full overflow-x-auto rounded bg-white p-2 shadow">
          <div className="p-2 font-semibold text-sm md:text-lg">
            <h2>Detail Setoran</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="*:whitespace-nowrap *:px-2 *:font-semibold">
                <th>No.</th>
                <th className="text-left">Bulan</th>
                <th>Tanggal Bayar</th>
                <th>Nomor Referensi Bank</th>
                <th className="text-center">Jumlah Bayar Perbulan</th>
                <th>Keterangan</th>
                <th>Bukti Bayar</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, i) => {
                const namaBulan = new Date(0, i).toLocaleString("id-ID", {
                  month: "long",
                });

                return (
                  <tr key={i} className="*:py-1.5">
                    <td className="text-center">{i + 1}</td>
                    <td>{namaBulan}</td>
                    <td className="text-center">
                      <Input
                        type="date"
                      />
                    </td>
                    <td className="px-1 text-center">
                      <Input type="number" className="w-full bg-slate-300" />
                    </td>
                    <td className="px-1 text-center">
                      <Input
                        type="number"
                        className="w-full max-w-40 bg-slate-300"
                      />
                    </td>
                    <td className="px-1 text-left">
                      <Input className="w-full min-w-52 bg-slate-300" />
                    </td>
                    <td className="px-1 text-left">
                      <Input
                        type="file"
                        className="w-full min-w-52 bg-slate-300"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> */}
      </form>
    </Layout>
  );
};

export default Setoran;
