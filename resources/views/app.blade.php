<!DOCTYPE html>
<html lang="en">
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    {{-- <link rel="preload" as="image" href="/img/logo.webp" type="image/webp"> --}}
    <link rel="preload" as="image" href="/img/logo.webp" type="image/webp" fetchpriority="high">

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body class="font-poppins antialiased">
    @inertia
</body>

</html>
