<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

    public function loginProcess(Request $request, AuthService $authService)
    {
        $request->validate([
            'nip' => 'required',
            'password' => 'required'
        ], [
            'nip.required' => 'NIP wajib diisi.',
            'nip.numeric' => 'NIP harus berupa angka.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 5 karakter'
        ]);

        $credentials = [
            'nip' => $request->nip,
            'password' => $request->password
        ];

        $redirectRoute = $authService->processLogin($credentials, $request->ip());

        return redirect()->route($redirectRoute);
    }

    public function logout(Request $request)
    {

        $user = Auth::user();

        if ($user) {
            $user->update([
                'historyLogin' => Carbon::now()
            ]);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
