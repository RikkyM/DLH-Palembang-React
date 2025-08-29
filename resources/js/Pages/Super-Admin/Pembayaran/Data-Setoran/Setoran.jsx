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
  };

  console.log(skrdOptions);

  const { data, setData, errors, post } = useForm(initialData);

  return (
    <Layout title="Input Setoran">
      <DropdownInput
        id="noSkrd"
        label="Pilih Nomor SKRD"
        placeholder="Silahkan Pilih Nomor SKRD..."
        value={data.noSkrd}
        onChange={(value) => {
            setData("noSkrd", value);

            const selected = skrdOptions.find(item => item.value === value)
            if (selected) {
                setData('namaObjekRetribusi', selected.namaObjekRetribusi);
            }
        }}
        options={skrdOptions}
        error={errors.pemilikId}
        required={true}
        valueKey="value"
        labelKey="label"
        className="col-span-2"
      />
      <FormInput className="col-span-2">
        <Label
          htmlFor="namaObjekRetribusi"
          className="after:text-red-500 after:content-['*']"
        >
          Nama Objek Retribusi
        </Label>
        <Input
          id="namaObjekRetribusi"
          className={`${errors.namaObjekRetribusi && "border border-red-500"}`}
          placeholder="Nama Objek Retribusi..."
          value={data.namaObjekRetribusi || ""}
          onChange={(e) =>
            handleInputChange("namaObjekRetribusi", e.target.value)
          }
        />
        {errors.namaObjekRetribusi && (
          <span className="text-xs text-red-500">
            {errors.namaObjekRetribusi}
          </span>
        )}
      </FormInput>
    </Layout>
  );
};

export default Setoran;
