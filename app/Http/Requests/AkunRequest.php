<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AkunRequest extends FormRequest
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
        $userId = $this->user()->id;

        return [
            'namaLengkap' => ['required', 'string', 'max:255'],
            'nip' => ['nullable', 'string', 'max:100'],
            'email' => [
                'nullable',
                'max:255',
                // Rule::unique('users', 'email')->ignore($userId)
            ],
            'kelamin' => ['nullable', Rule::in(['Laki-laki', 'Perempuan'])],
            'pangkat' => ['nullable', 'string', 'max:255'],
            'golongan' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            // 'current_password' => ['required_with:password','current_password'], // jika dipakai
        ];
    }
}
