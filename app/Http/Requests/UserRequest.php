<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
        return [
            'username' => 'required|unique:users,username',
            'namaLengkap' => 'required|string|max:50',
            'jabatan' => 'required|string|max:100',
            'nip' => 'required|numeric|unique:users,nip',
            'email' => 'nullable|email|unique:users,email',
            'lokasi' => 'required|string|max:255',
            'kelamin' => 'nullable|in:Laki-laki,Perempuan',
            'uptdId' => 'required|exists:uptd,id',
            'pangkat' => 'required|string|max:100',
            'golongan' => 'required|string|max:100',
            'deskripsi' => 'required|string|max:255',
            'role' => 'required|string|in:ROLE_SEKDIN,ROLE_PENDAFTAR,ROLE_KUPTD,ROLE_KATIM,ROLE_KASUBAG_TU_UPDT,ROLE_KADIN,ROLE_KABID,ROLE_BENDAHARA',
            'password' => 'required|string|min:5|confirmed'
        ];
    }

    public function messages(): array
    {
        return [
            'namaLengkap.required' => 'Nama lengkap wajib diisi.',
            'namaLengkap.max' => 'Nama lengkap maksimal 50 karakter.',
            'jabatan.required' => 'Jabatan wajib diisi.',
            'jabatan.max' => 'Jabatan maksimal 100 karakter.',
            'nip.required' => 'NIP wajib diisi.',
            'nip.numeric' => 'NIP harus berupa angka.',
            'nip.unique' => 'NIP sudah terdaftar.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'lokasi.required' => 'Lokasi wajib diisi.',
            'lokasi.max' => 'Lokasi maksimal 255 karakter.',
            'kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'kelamin.in' => 'Jenis kelamin harus laki-laki atau perempuan.',
            'uptdId.required' => 'UPTD wajib dipilih.',
            'uptdId.exists' => 'UPTD yang dipilih tidak valid.',
            'pangkat.required' => 'Pangkat wajib diisi.',
            'pangkat.max' => 'Pangkat maksimal 100 karakter.',
            'golongan.required' => 'Golongan wajib diisi.',
            'golongan.max' => 'Golongan maksimal 100 karakter.',
            'deskripsi.required' => 'Deskripsi wajib diisi.',
            'deskripsi.max' => 'Deskripsi maksimal 255 karakter.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role yang dipilih tidak valid.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 5 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ];
    }

    public function attributes(): array
    {
        return [
            'namaLengkap' => 'nama lengkap',
            'uptdId' => 'UPTD',
            'kelamin' => 'jenis kelamin',
        ];
    }
}
