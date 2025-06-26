import DropdownInput from "@/Components/DropdownInput";
import Layout from "../../Layout";
import { useForm } from "@inertiajs/react";

const Create = ({
    pemohonOptions,
    kecamatanOptions,
    kelurahanOptions,
    kategoriOptions,
    subKategoriOptions,
}) => {
    const { data, setData, errors, processing, clearErrors, post } = useForm();

    const filteredKelurahanOptions = kelurahanOptions[data.kodeKecamatan] || [];
    const filteredSubKategoriOptions = subKategoriOptions[data.kodeKategori] || [];

    const handleSubmit = (e) => {};

    return (
        <Layout title="FORM OBJEK RETRIBUSI">
            <section className="p-3">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-5"
                >
                    <div className="flex flex-col gap-1.5 text-sm col-span-2">
                        <label
                            htmlFor="namaObjekRetribusi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nama Objek Retribusi
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="namaObjekRetribusi"
                            autoComplete="off"
                            placeholder="Nama Objek Retribusi..."
                        />
                    </div>
                    <DropdownInput
                        id="pemohon"
                        label="Pilih Pemohon"
                        placeholder="Silahkan Pilih Pemohon..."
                        value={data.pemilikId}
                        onChange={(value) => setData("pemilikId", value)}
                        options={pemohonOptions}
                        error={errors.pemilikId}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        className="col-span-2"
                    />
                    <div className="flex flex-col gap-1.5 text-sm col-span-2">
                        <label
                            htmlFor="alamatObjekRetribusi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Alamat Objek Retribusi
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="alamatObjekRetribusi"
                            autoComplete="off"
                            placeholder="contoh: Jalan Srikandi Nomor 16/ Lorong Asahan Nomor 38"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="rt"
                            className="after:content-['*'] after:text-red-500"
                        >
                            RT
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="rt"
                            autoComplete="off"
                            placeholder="RT"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="rw"
                            className="after:content-['*'] after:text-red-500"
                        >
                            RW
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="rw"
                            autoComplete="off"
                            placeholder="RW"
                        />
                    </div>
                    <DropdownInput
                        id="kecamatan"
                        label="Pilih Kecamatan"
                        placeholder="Silahkan Pilih Kecamatan..."
                        value={data.kodeKecamatan}
                        onChange={(value) => setData("kodeKecamatan", value)}
                        options={kecamatanOptions}
                        error={errors.kodeKecamatan}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <DropdownInput
                        id="kelurahan"
                        label="Pilih Kelurahan"
                        placeholder="Silahkan Pilih Kelurahan..."
                        value={data.kodeKelurahan}
                        onChange={(value) => setData("kodeKelurahan", value)}
                        options={filteredKelurahanOptions}
                        error={errors.kodeKelurahan}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        disabled={!data.kodeKecamatan}
                    />
                    <div className="flex flex-col gap-1.5 text-sm col-span-2">
                        <label
                            htmlFor="deskripsi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Deskripsi Usaha
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="deskripsi"
                            autoComplete="off"
                            placeholder="Deskripsi Usaha..."
                        />
                    </div>
                    <DropdownInput
                        id="kategori"
                        label="Pilih Kategori"
                        placeholder="Silahkan Pilih Kategori..."
                        value={data.kodeKategori}
                        onChange={(value) => setData("kodeKategori", value)}
                        options={kategoriOptions}
                        error={errors.kodeKategori}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <DropdownInput
                        id="subkategori"
                        label="Pilih Sub Kategori"
                        placeholder="Silahkan Pilih Sub Kategori..."
                        value={data.kodeSubKategori}
                        onChange={(value) => setData("kodeSubKategori", value)}
                        options={filteredSubKategoriOptions}
                        error={errors.kodeSubKategori}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        disabled={!data.kodeKategori}
                    />

                    
                </form>
            </section>
        </Layout>
    );
};

export default Create;
