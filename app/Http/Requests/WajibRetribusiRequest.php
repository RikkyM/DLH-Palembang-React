<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class WajibRetribusiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isEdit = $this->isMethod('put') || $this->isMethod('patch');
        $rules = [
            'noSkrd' => $isEdit ? [
                'sometimes',
                Rule::unique('wajib_retribusi', 'noSkrd')->ignore($this->retribusi, 'id')
            ] : [
                'required',
                Rule::unique('wajib_retribusi', 'noSkrd')
            ],
            'namaObjekRetribusi' => 'required|string',
            'pemilikId' => 'required',
            'penagihId' => 'required',
            'alamatObjekRetribusi' => 'required|string',
            'rt' => 'required',
            'rw' => 'required',
            'kodeKecamatan' => 'required',
            'kodeKelurahan' => 'required',
            'bentukUsaha' => 'required',
            'deskripsi' => 'required',
            'kodeKategori' => 'required',
            'kodeSubKategori' => 'required',
            'statusTempat' => 'required',
            'jBangunan' => 'required',
            'jLantai' => 'required',
            'linkMap' => 'nullable|url',
            'latitude' => 'required',
            'longitude' => 'required',
            'jenisTarif' => 'required|in:tarif,tarif2',
            'variabelValues.bulan' => 'required',
            'variabelValues.*' => 'sometimes',
            // 'fotoBangunan' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            // 'fotoBerkas' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'fotoBangunan' => [
                $isEdit ? 'nullable' : 'required',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:5120'
            ],
            'fotoBerkas' => 'sometimes|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'keteranganBulan' => 'required',
            'tanggalSkrd' => 'required|date',
            'tarifRetribusi' => 'required|numeric|min:1',
            'totalRetribusi' => 'required|numeric|min:1',
        ];

        if ($this->isMethod('post')) {
            $rules['noWajibRetribusi'] = 'required|unique:wajib_retribusi,noWajibRetribusi';
            $rules['fotoBangunan'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:5120';
            $rules['fotoBerkas'] = 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['noWajibRetribusi'] = 'required|unique:wajib_retribusi,noWajibRetribusi,' . $this->retribusi;
            $rules['fotoBangunan'] = 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120';
            $rules['fotoBerkas'] = 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'namaObjekRetribusi.required' => 'Nama objek retribusi wajib diisi.',
            'namaObjekRetribusi.string' => 'Nama objek retribusi harus berupa teks.',
            'pemilikId.required' => 'Pemilik objek retribusi wajib dipilih.',
            'penagihId.required' => 'Penagih wajib diisi.',
            'alamatObjekRetribusi.required' => 'Alamat objek retribusi wajib diisi.',
            'alamatObjekRetribusi.string' => 'Alamat objek retribusi harus berupa teks.',
            'rt.required' => 'RT wajib diisi.',
            'rw.required' => 'RW wajib diisi.',
            'kodeKecamatan.required' => 'Kecamatan wajib dipilih.',
            'kodeKelurahan.required' => 'Kelurahan wajib dipilih.',
            'bentukUsaha.required' => 'Bentuk usaha wajib dipilih.',
            'deskripsi.required' => 'Deskripsi objek retribusi wajib diisi.',
            'kodeKategori.required' => 'Kategori objek retribusi wajib dipilih.',
            'kodeSubKategori.required' => 'Sub kategori objek retribusi wajib dipilih.',
            'statusTempat.required' => 'Status tempat wajib dipilih.',
            'jBangunan.required' => 'Jumlah bangunan wajib diisi.',
            'jLantai.required' => 'Jumlah lantai wajib diisi.',
            'linkMap.required' => 'Link peta lokasi wajib diisi.',
            'linkMap.url' => 'Link peta lokasi harus berupa URL yang valid.',
            'latitude.required' => 'Latitude koordinat lokasi wajib diisi.',
            'longitude.required' => 'Longitude koordinat lokasi wajib diisi.',
            'variabelValues.bulan.required' => 'Bulan wajib diisi.',
            'fotoBangunan.required' => 'Foto bangunan wajib diunggah.',
            'fotoBangunan.file' => 'Foto bangunan harus berupa file.',
            'fotoBangunan.mimes' => 'Foto bangunan harus berformat PDF, JPG, JPEG, atau PNG.',
            'fotoBangunan.max' => 'Ukuran foto bangunan maksimal 5MB.',
            'fotoBerkas.required' => 'Foto berkas wajib diunggah.',
            'fotoBerkas.file' => 'Foto berkas harus berupa file.',
            'fotoBerkas.mimes' => 'Foto berkas harus berformat PDF, JPG, JPEG, atau PNG.',
            'fotoBerkas.max' => 'Ukuran foto berkas maksimal 5MB.',
            'variabelValues.array' => 'Variabel values harus berupa array.',
            'keteranganBulan.required' => 'Keterangan bulan wajib diisi.',
            'tanggalSkrd.required' => 'Tanggal SKRD wajib diisi.',
            'tanggalSkrd.date' => 'Tanggal SKRD harus format tanggal.',
            'tarifRetribusi.required' => 'Tarif retribusi wajib diisi.',
            'tarifRetribusi.numeric' => 'Tarif retribusi harus angka.',
            'tarifRetribusi.min' => 'Tarif retribusi tidak boleh 0',
            'totalRetribusi.required' => 'Total retribusi wajib diisi.',
            'totalRetribusi.numeric' => 'Total retribusi harus angka.',
            'totalRetribusi.min' => 'Total retribusi tidak boleh 0'
        ];
    }
}
