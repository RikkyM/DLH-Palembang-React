<!DOCTYPE html>
<html>

<head>
    <title>Import Setoran</title>
</head>

<body>
    <h2>Upload Excel Setoran</h2>
    <form action="{{ route('super-admin.setoran-import') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file" required>
        <button type="submit">Preview</button>
    </form>
</body>

</html>
