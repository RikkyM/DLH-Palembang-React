import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const InstansiForm = ({ data, errors, processing, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 text-sm lg:grid-cols-2"
    >
      <FormInput>
        <Label htmlFor="namaInstansi">Nama Instansi</Label>
        <Input
          id="namaInstansi"
          className={`${errors.namaInstansi && "border border-red-500"} text-xs md:text-sm`}
          value={data.namaInstansi}
          onChange={e => onChange('')}
        />
      </FormInput>
    </form>
  );
};

export default InstansiForm;
