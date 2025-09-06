<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daftar Username</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
    </style>
</head>
<body>
    <h2>Daftar Username</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Username</th>
                <th>Jabatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $i => $user)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ $user->namaLengkap }}</td>
                <td>{{ $user->username ?? "-" }}</td>
                <td>{{ $user->jabatan ?? "-" }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
