import { Head, useForm } from "@inertiajs/react";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import DropdownInput from "@/Components/DropdownInput";

const Akun = ({ userData, role }) => {
  const initialData = {
    namaLengkap: userData.namaLengkap ?? "",
    nip: userData.nip ?? "",
    email: userData.email ?? "",
    kelamin: userData.kelamin ?? "",
    pangkat: userData.pangkat ?? "",
    golongan: userData.golongan ?? "",
    password: "",
    password_confirmation: "",
  };
  const { data, setData, processing, errors, clearErrors, put } =
    useForm(initialData);

  const roleConfig = {
    ROLE_SUPERADMIN: "super-admin",
    ROLE_PENDAFTAR: "pendaftar",
    ROLE_KUPTD: "kuptd",
    ROLE_KATIM: "katim",
    ROLE_KABID: "kabid",
    ROLE_KASUBAG_TU_UPDT: "kasubag",
    ROLE_BENDAHARA: "bendahara",
  };

  const routeConfig = roleConfig[role];

  console.log(routeConfig);

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route(`${routeConfig}.akun.update`), {
      preserveScroll: true,
      onSuccess: () => {
        setData("password", "");
        setData("password_confirmation", "");
      },
    });
  };

  return (
    <>
      <Head title="Akun" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2"
        >
          <FormInput>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <Input
              id="namaLengkap"
              className={`${errors.namaLengkap && "border border-red-500"}`}
              value={data.namaLengkap}
              onChange={(e) => {
                setData("namaLengkap", e.target.value);
              }}
            />
            {errors.namaLengkap && (
              <span className="text-xs text-red-500">{errors.namaLengkap}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              className={`${errors.nip && "border border-red-500"}`}
              value={data.nip}
              onChange={(e) => {
                setData("nip", e.target.value);
              }}
            />
            {errors.nip && (
              <span className="text-xs text-red-500">{errors.nip}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="off"
              className={`${errors.email && "border border-red-500"}`}
              value={data.email}
              onChange={(e) => {
                setData("email", e.target.value);
              }}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </FormInput>
          <DropdownInput
            id="kelamin"
            label="Jenis Kelamin"
            placeholder="Pilih kelamin..."
            value={data.kelamin}
            onChange={(value) => setData("kelamin", value)}
            options={[
              { value: "Laki-laki", label: "Laki-laki" },
              { value: "Perempuan", label: "Perempuan" },
            ]}
            error={errors.kelamin}
            required={true}
            valueKey="value"
            labelKey="label"
          />
          <FormInput>
            <Label htmlFor="pangkat">Pangkat</Label>
            <Input
              id="pangkat"
              className={`${errors.pangkat && "border border-red-500"}`}
              value={data.pangkat}
              onChange={(e) => {
                setData("pangkat", e.target.value);
              }}
            />
            {errors.pangkat && (
              <span className="text-xs text-red-500">{errors.pangkat}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="golongan">Golongan</Label>
            <Input
              id="golongan"
              className={`${errors.golongan && "border border-red-500"}`}
              value={data.golongan}
              onChange={(e) => {
                setData("golongan", e.target.value);
              }}
            />
            {errors.golongan && (
              <span className="text-xs text-red-500">{errors.golongan}</span>
            )}
          </FormInput>
          <div className="grid grid-cols-1 gap-3 lg:col-span-2">
            <FormInput>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                className={`${errors.password && "border border-red-500"}`}
                value={data.password}
                onChange={(e) => {
                  setData("password", e.target.value);
                }}
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
            </FormInput>
            <FormInput>
              <Label htmlFor="password_confirmation">
                Password Confirmation
              </Label>
              <Input
                id="password_confirmation"
                className={`${errors.password_confirmation && "border border-red-500"}`}
                value={data.password_confirmation}
                onChange={(e) => {
                  setData("password_confirmation", e.target.value);
                }}
              />
              {errors.password_confirmation && (
                <span className="text-xs text-red-500">
                  {errors.password_confirmation}
                </span>
              )}
            </FormInput>
            <button
              type="submit"
              className={`w-max place-self-end rounded bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 ${processing && "cursor-not-allowed bg-green-400 hover:bg-green-400"}`}
              disabled={processing}
            >
              {processing ? "Proses..." : "Simpan"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Akun;
