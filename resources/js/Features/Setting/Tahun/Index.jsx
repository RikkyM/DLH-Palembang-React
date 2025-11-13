import { Head, useForm, usePage } from "@inertiajs/react";
import { useToast } from "@/Context/ToastContext";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import { roleConfig } from "@/Constants/roleConfig";

const Index = ({ itm }) => {
  const { showToast } = useToast();
  const { props } = usePage();
  const role = props[0]?.auth?.user?.role;
  const { data, setData, errors, processing, put } = useForm({
    tahun: itm?.tahun ?? "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route(`${roleConfig[role]}.tahun-retribusi-update`), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: () => showToast("Berhasil update tahun Retribusi.", "success"),
      onError: (e) => showToast("Gagal update tahun Retribusi ", "error"),
    });
  };
  return (
    <>
      <Head title="Tahun Retribusi" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 text-sm">
          <FormInput className="">
            <Label htmlFor="tahun">Tahun</Label>
            <Input
              id="tahun"
              className={`${errors.tahun && "border border-red-500"} w-max text-xs md:text-sm`}
              value={data.tahun}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                if (value.length <= 4) {
                  setData("tahun", value);
                }
              }}
            />
            {errors.tahun && (
              <span className="text-xs text-red-500">{errors.tahun}</span>
            )}
          </FormInput>
          <button
            type="submit"
            disabled={processing}
            className={`w-max rounded p-2 text-xs font-medium text-white md:text-sm ${processing ? "pointer-events-none bg-blue-300" : "pointer-events-auto bg-blue-500"}`}
          >
            {processing ? "Loading..." : itm ? "Update" : "Tambah"}
          </button>
        </form>
      </section>
    </>
  );
};

export default Index;
