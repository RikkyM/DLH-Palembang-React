<!DOCTYPE html>
<html>

<head>
    <title>Import Retribusi</title>
</head>

<body>
    <h2>Upload Excel Retribusi</h2>
    <form action="{{ route('super-admin.retribusi-import') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file" required>
        <button type="submit">Preview</button>
    </form>

    <h2>Upload Excel Skrd</h2>
    <form action="{{ route('super-admin.skrd-import') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="skrd" required>
        <button type="submit">Preview</button>
    </form>
</body>

</html>
