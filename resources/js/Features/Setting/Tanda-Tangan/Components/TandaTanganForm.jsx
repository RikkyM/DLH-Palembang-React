import { Head } from "@inertiajs/react";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const TandaTanganForm = ({ data, errors, processing, onChange, onSubmit }) => {
  return (
    <>
      <Head title="Penanda Tangan" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2"
        >
          <FormInput className="lg:col-span-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              className={`${errors.nama && "border border-red-500"}`}
              value={data.nama}
              onChange={(e) => onChange("nama", e.target.value)}
            />
            {errors.nama && (
              <span className="text-xs text-red-500">{errors.namaLengkap}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              className={`${errors.nip && "border border-red-500"}`}
              value={data.nip}
              onChange={(e) => onChange("nip", e.target.value)}
            />
            {errors.nip && (
              <span className="text-xs text-red-500">{errors.nip}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="pangkat">Pangkat</Label>
            <Input
              id="pangkat"
              className={`${errors.pangkat && "border border-red-500"}`}
              value={data.pangkat}
              onChange={(e) => onChange("pangkat", e.target.value)}
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
              onChange={(e) => onChange("golongan", e.target.value)}
            />
            {errors.golongan && (
              <span className="text-xs text-red-500">{errors.golongan}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="jabatan1">Jabatan 1</Label>
            <Input
              id="jabatan1"
              className={`${errors.jabatan1 && "border border-red-500"}`}
              value={data.jabatan1}
              onChange={(e) => onChange("jabatan1", e.target.value)}
            />
            {errors.jabatan1 && (
              <span className="text-xs text-red-500">{errors.jabatan1}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="jabatan2">Jabatan 2</Label>
            <Input
              id="jabatan2"
              className={`${errors.jabatan2 && "border border-red-500"}`}
              value={data.jabatan2}
              onChange={(e) => onChange("jabatan2", e.target.value)}
            />
            {errors.jabatan2 && (
              <span className="text-xs text-red-500">{errors.jabatan2}</span>
            )}
          </FormInput>
          <FormInput>
            <Label htmlFor="kota">Kota</Label>
            <Input
              id="kota"
              className={`${errors.kota && "border border-red-500"}`}
              value={data.kota}
              onChange={(e) => onChange("kota", e.target.value)}
            />
            {errors.kota && (
              <span className="text-xs text-red-500">{errors.kota}</span>
            )}
          </FormInput>
          <div className="flex justify-end lg:col-span-2">
            <button
              type="submit"
              disabled={processing}
              className={`w-max rounded px-3 py-1.5 font-semibold text-white ${processing ? "pointer-events-none bg-green-300" : "pointer-events-auto bg-green-500"}`}
            >
              {processing ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default TandaTanganForm;
