<!DOCTYPE html>
<html>
<head>
    <title>Import Sub Kategori</title>
</head>
<body>
    <h2>Upload Excel Sub Kategori</h2>
    <form action="{{ route('super-admin.excel') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file" required>
        <button type="submit">Preview</button>
    </form>
</body>
</html>
