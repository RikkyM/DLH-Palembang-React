import DropdownInput from "@/Components/DropdownInput";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const Step2 = ({ data, setData, errors, clearErrors }) => {
  return (
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
          <FormInput className="col-span-2 lg:col-span-1 w-full">
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
              Jumlah Bayar
            </Label>
            <Input
              id="jumlahBayar"
              className={`${errors.jumlahBayar && "border border-red-500"}`}
              placeholder="Jumlah Bayar..."
              value={
                data.jumlahBayar
                    ? Intl.NumberFormat('id-ID', {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0
                    }).format(data.jumlahBayar) : ""}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                value = value.replace(/^0+/, "");

                setData("jumlahBayar", value);
                clearErrors("jumlahBayar");
              }}
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
      </div>
    </div>
  );
};

export default Step2;
