<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
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
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return [
                'noSkrd' => 'nullable|exists:skrd,noSkrd',
                'jumlahBulan' => 'nullable|numeric',
                'satuan' => 'nullable',
                'namaBank' => 'nullable',
                'pengirim' => 'nullable',
                'noRekening' => 'nullable|numeric'
            ];
        }

        return [
            'noSkrd'       => 'required|exists:skrd,noSkrd',
            'jumlahBulan'  => 'required|numeric',
            'satuan'       => 'required',
            'namaBank'     => 'required',
            'pengirim'     => 'required',
            'noRekening'   => 'required|numeric',
        ];
    }

    public function messages(): array
    {
        return [
            'noSkrd.required'       => 'Nomor SKRD wajib diisi.',
            'noSkrd.exists'         => 'Nomor SKRD tidak ditemukan dalam data SKRD.',
            'jumlahBulan.required'  => 'Jumlah bulan wajib diisi.',
            'jumlahBulan.numeric'   => 'Jumlah bulan harus berupa angka.',
            'satuan.required'       => 'Satuan wajib diisi.',
            'namaBank.required'     => 'Nama bank wajib diisi.',
            'pengirim.required'     => 'Nama pengirim wajib diisi.',
            'noRekening.required'   => 'Nomor rekening wajib diisi.',
            'noRekening.numeric'    => 'Nomor rekening harus berupa angka.',
        ];
    }
}
