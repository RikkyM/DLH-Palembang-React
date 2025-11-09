import { Head, router, useForm } from "@inertiajs/react";
import { useToast } from "@/Context/ToastContext";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import { FilePlus } from "lucide-react";
import { useEffect, useMemo } from "react";

const Index = ({ info }) => {
  const { showToast } = useToast();
  const { data, setData, errors, processing } = useForm({
    gambar: info?.gambar ?? "",
  });

  const getExistingImageUrl = () => {
    if (info?.gambar && typeof data.gambar === "string") {
      return route("bukti-bayar", {
        filename: data.gambar,
      });
    }
    return null;
  };

  const previewImg = useMemo(() => {
    if (data?.gambar instanceof File) {
      return URL.createObjectURL(data.gambar);
    }
    return null;
  }, [data.gambar]);

  useEffect(() => {
    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  const handleSubmit = (e) => {
    e.preventDefault();

    router.post(
      route("super-admin.informasi-update"),
      {
        ...data,
        _method: "put",
      },
      {
        preserveScroll: true,
        onSuccess: () => showToast("Berhasil mengubah informasi.", "success"),
      },
    );
  };

  return (
    <>
      <Head title="Informasi" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-3"
        >
          <FormInput>
            <Label htmlFor="gambar">Gambar</Label>
            <Label
              htmlFor="gambar"
              className="group relative flex items-center justify-center overflow-hidden border border-dashed border-slate-300 p-2"
            >
              <div className="flex w-max max-w-full flex-col gap-3 p-3 text-center">
                {/* {progress ? (
                  <LoaderCircle className="size-7 animate-spin" />
                ) : } */}
                {data && data.gambar ? (
                  <>
                    <img
                      src={previewImg || getExistingImageUrl()}
                      alt="Preview"
                      className="mx-auto max-h-96 max-w-max border border-gray-300 shadow-md"
                    />
                    {/* <img
                      src={previewImg}
                      alt="Preview"
                      className="mx-auto max-h-44 max-w-max border border-gray-300 shadow-md"
                    /> */}
                    {/* <p className="max-w-72 text-xs">
                      Gambar dipilih: {data?.gambar?.name}
                    </p> */}
                  </>
                ) : (
                  <>
                    <FilePlus className="h-full max-h-7 w-full text-center" />
                    <p className="text-xs">
                      Choose image or drag and drop to upload
                    </p>
                    <div className="inline-block w-full cursor-pointer rounded border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-medium">
                      Choose File
                    </div>
                  </>
                )}
              </div>
              <Input
                id="gambar"
                type="file"
                className="absolute h-full w-full opacity-0"
                accept="image/*"
                onChange={(e) => {
                  setData("gambar", e.target.files[0]);
                }}
              />
              {errors.gambar && (
                <span className="text-xs text-red-500">{errors.gambar}</span>
              )}
            </Label>
          </FormInput>
          {/* <FormInput>
            <Label htmlFor="teks">Teks</Label>
            <Input className="bg-gray-200 focus:ring-1 focus:ring-blue-500"/>
          </FormInput> */}
          <div className="place-self-end">
            <button
              type="submit"
              className={`rounded px-3 py-1.5 text-sm font-medium text-white ${data.gambar ? "bg-blue-400" : "bg-green-400"}`}
            >
              {processing ? "Loading..." : data.gambar ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Index;
