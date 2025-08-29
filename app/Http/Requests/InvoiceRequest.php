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
                // 'namaBank' => 'nullable',
                // 'pengirim' => 'nullable',
                // 'noRekening' => 'nullable|numeric',
                'tanggalTerbit' => 'nullable|date',
                'jatuhTempo' => 'nullable|date|after_or_equal:tanggalTerbit',
            ];
        }

        return [
            'noSkrd'       => 'required|exists:skrd,noSkrd',
            'jumlahBulan'  => 'required|numeric',
            'satuan'       => 'required',
            // 'namaBank'     => 'required',
            // 'pengirim'     => 'required',
            // 'noRekening'   => 'required|numeric',
            'tanggalTerbit' => 'required|date',
            'jatuhTempo' => 'required|date|after_or_equal:tanggalTerbit',
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
            'tanggalTerbit.required' => 'Tanggal terbit wajib diisi.',
            'tanggalTerbit.date'     => 'Tanggal terbit harus berupa tanggal yang valid.',
            'jatuhTempo.required'    => 'Tanggal jatuh tempo wajib diisi.',
            'jatuhTempo.date'        => 'Tanggal jatuh tempo harus berupa tanggal yang valid.',
            'jatuhTempo.after_or_equal' => 'Tanggal jatuh tempo tidak boleh sebelum tanggal terbit.',
        ];
    }
}
