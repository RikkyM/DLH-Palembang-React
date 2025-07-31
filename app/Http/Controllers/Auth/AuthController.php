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
            'login' => 'required',
            'password' => 'required|min:5'
        ], [
            'login.required' => 'NIP atau Username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 5 karakter'
        ]);

        $credentials = [
            'login' => $request->login,
            'password' => $request->password
        ];

        $user = Auth::user();

        if ($user) {
            $user->update([
                'historyLogin' => Carbon::now()
            ]);
        }

        $redirectRoute = $authService->processLogin($credentials, $request->ip());
        return redirect()->route($redirectRoute);
    }

    public function logout(Request $request)
    {

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
