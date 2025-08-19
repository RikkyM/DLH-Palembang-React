<?php

namespace App\Http\Requests;

use App\Models\Pemilik;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PemohonRequest extends FormRequest
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
        $pemilikId = $this->route('pemohon');

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return [
                'nik' => 'nullable|digits:16|unique:pemilik,nik,' . $pemilikId. ',id',
                'namaPemilik' => 'nullable|string|min:5',
                'alamat' => 'nullable|string|min:5|max:255',
                'tempatLahir' => 'nullable|string|min:3',
                'tanggalLahir' => 'nullable|date',
                'kodeKecamatan' => 'nullable|exists:kecamatan,kodeKecamatan',
                'kodeKelurahan' => 'nullable|exists:kelurahan,kodeKelurahan',
                'noHP' => 'nullable|digits_between:10,15',
                'email' => 'nullable|email|min:5|unique:pemilik,email,' . $pemilikId. ',id',
                'jabatan' => 'nullable|string|min:3',
            ];
        }

        return [
            'nik' => 'required|digits:16|unique:pemilik,nik,' . $pemilikId,
            'namaPemilik' => 'required|string|min:5',
            'alamat' => 'required|string|min:5|max:255',
            'tempatLahir' => 'required|string|min:3',
            'tanggalLahir' => 'required|date',
            'kodeKecamatan' => 'required|exists:kecamatan,kodeKecamatan',
            'kodeKelurahan' => 'required|exists:kelurahan,kodeKelurahan',
            'noHP' => 'required|digits_between:10,15',
            'email' => 'nullable|email|min:5|unique:pemilik,email,' . $pemilikId,
            'jabatan' => 'required|string|min:3',
        ];
    }

    public function messages(): array
    {
        return [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus terdiri dari 16 digit angka.',
            'nik.unique' => 'NIK sudah digunakan',
            'namaPemilik.required' => 'Nama pemilik wajib diisi.',
            'namaPemilik.min' => 'Nama pemilik minimal terdiri dari 5 karakter.',
            'alamat.required' => 'Alamat wajib diisi.',
            'alamat.min' => 'Alamat minimal 5 karakter.',
            'alamat.max' => 'Alamat maksimal 255 karakter.',
            'tempatLahir.required' => 'Tempat lahir wajib diisi.',
            'tempatLahir.min' => 'Tempat lahir minimal 3 karakter.',
            'tanggalLahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggalLahir.date' => 'Format tanggal lahir tidak valid.',
            'kodeKecamatan.required' => 'Kecamatan wajib dipilih.',
            'kodeKecamatan.exists' => 'Kecamatan yang dipilih tidak valid.',
            'kodeKelurahan.required' => 'Kelurahan wajib dipilih.',
            'kodeKelurahan.exists' => 'Kelurahan yang dipilih tidak valid.',
            'noHP.required' => 'Nomor HP wajib diisi.',
            'noHP.digits_between' => 'Nomor HP harus terdiri dari 10 sampai 15 digit angka.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.min' => 'Email minimal 5 karakter.',
            'jabatan.required' => 'Jabatan wajib diisi.',
            'jabatan.min' => 'Jabatan minimal 3 karakter.',
        ];
    }

    public function handle(?int $data = null): Pemilik
    {
        $validated = $this->validated();

        if ($data) {
            $pemohon = Pemilik::findOrFail($data);
            $pemohon->update($validated);
            return $pemohon;
        }

        return Pemilik::create($validated);
    }
}
