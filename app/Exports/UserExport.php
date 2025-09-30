<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class UserExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithColumnFormatting
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return User::with('uptd')->select('namaLengkap', 'username', 'jabatan', 'nip', 'email', 'kelamin', 'pangkat', 'golongan', 'lokasi', 'uptdId')->get();
    }

    public function map($user): array
    {
        return [
            $user->namaLengkap,
            $user->username,
            $user->jabatan,
            "'" . $user->nip,
            $user->email,
            $user->kelamin,
            $user->pangkat,
            $user->golongan,
            $user->uptd->namaUptd,
            $user->lokasi
        ];
    }

    public function headings(): array
    {
        return ['Nama Lengkap', 'Username', 'Jabatan', 'NIP', 'E-Mail', 'Jenis Kelamin', 'Pangkat', 'Golongan', 'UPTD', 'Lokasi'];
    }

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_TEXT
        ];
    }
}
