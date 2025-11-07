import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const InstansiForm = ({
  instansi = null,
  data,
  errors,
  processing,
  onChange,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2"
    >
      <FormInput className="col-span-1 lg:col-span-2">
        <Label htmlFor="namaInstansi">Nama Instansi</Label>
        <Input
          id="namaInstansi"
          className={`${errors.namaInstansi && "border border-red-500"} text-xs md:text-sm`}
          value={data.namaInstansi}
          onChange={(e) => onChange("namaInstansi", e.target.value)}
        />
        {errors.namaInstansi && (
          <span className="text-xs text-red-500">{errors.namaInstansi}</span>
        )}
      </FormInput>
      <FormInput className="col-span-1 lg:col-span-2">
        <Label htmlFor="alamatInstansi">Alamat Instansi</Label>
        <Input
          id="alamatInstansi"
          className={`${errors.alamatInstansi && "border border-red-500"} text-xs md:text-sm`}
          value={data.alamatInstansi}
          onChange={(e) => onChange("alamatInstansi", e.target.value)}
        />
        {errors.alamatInstansi && (
          <span className="text-xs text-red-500">{errors.alamatInstansi}</span>
        )}
      </FormInput>
      <FormInput>
        <Label htmlFor="noTelepon">No. Telepon</Label>
        <Input
          id="noTelepon"
          type="number"
          className={`${errors.noTelepon && "border border-red-500"} text-xs md:text-sm`}
          value={data.noTelepon}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "")

            if (value.length <= 14) {
              onChange("noTelepon", value);
            }
          }}
        />
        {errors.noTelepon && (
          <span className="text-xs text-red-500">{errors.noTelepon}</span>
        )}
      </FormInput>
      <FormInput>
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          className={`${errors.email && "border border-red-500"} text-xs md:text-sm`}
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email}</span>
        )}
      </FormInput>
      <FormInput className="col-span-1 lg:col-span-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          className={`${errors.website && "border border-red-500"} text-xs md:text-sm`}
          value={data.website}
          onChange={(e) => onChange("website", e.target.value)}
        />
        {errors.website && (
          <span className="text-xs text-red-500">{errors.website}</span>
        )}
      </FormInput>
      <FormInput>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          className={`${errors.instagram && "border border-red-500"} text-xs md:text-sm`}
          value={data.instagram}
          onChange={(e) => onChange("instagram", e.target.value)}
        />
        {errors.instagram && (
          <span className="text-xs text-red-500">{errors.instagram}</span>
        )}
      </FormInput>
      <FormInput>
        <Label htmlFor="tiktok">Tiktok</Label>
        <Input
          id="tiktok"
          className={`${errors.tiktok && "border border-red-500"} text-xs md:text-sm`}
          value={data.tiktok}
          onChange={(e) => onChange("tiktok", e.target.value)}
        />
        {errors.tiktok && (
          <span className="text-xs text-red-500">{errors.tiktok}</span>
        )}
      </FormInput>
      <div className="flex justify-end lg:col-span-2">
        <button
          type="submit"
          disabled={processing}
          className={`w-max rounded px-3 py-1.5 text-xs font-medium text-white md:text-sm ${processing ? "pointer-events-none bg-blue-300" : "pointer-events-auto bg-blue-500"}`}
        >
          {/* {processing ? "Loading..." : "Update"} */}
          {/* {console.log(instansi)} */}
          {processing ? "Loading..." : instansi ? "Update" : "Tambah"}
        </button>
      </div>
    </form>
  );
};

export default InstansiForm;
