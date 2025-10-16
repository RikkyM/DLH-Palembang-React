<!DOCTYPE html>
<html>

<head>
    <title>Import Pemohon</title>
</head>

<body>
    <h2>Upload Excel Pemohon</h2>
    <form action="{{ route('super-admin.pemohon-import') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file" required>
        <button type="submit">Preview</button>
    </form>
</body>

</html>
