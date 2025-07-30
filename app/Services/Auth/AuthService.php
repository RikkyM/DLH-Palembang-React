<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const RATE_LIMIT_MAX_ATTEMPTS = 4;

    public function processLogin($credentials, $userIp)
    {
        dd($credentials);
        $rateLimitKey = $this->getRateLimitKey($userIp);
        $this->checkTooManyAttempts($rateLimitKey);

        // Coba login dengan NIP atau username
        $loginSuccess = $this->attemptLogin($credentials['login'], $credentials['password']);

        if ($loginSuccess) {
            $this->handleSuccess($rateLimitKey, $userIp);
            return $this->getRedirectUrl();
        } else {
            $this->handleFailed($rateLimitKey, $userIp);
            throw ValidationException::withMessages([
                'message' => 'NIP/Username atau Password salah.'
            ]);
        }
    }

    private function attemptLogin($loginField, $password)
    {
        // Coba login dengan NIP terlebih dahulu
        if (Auth::attempt(['nip' => $loginField, 'password' => $password])) {
            return true;
        }

        // Jika gagal, coba login dengan username
        if (Auth::attempt(['username' => $loginField, 'password' => $password])) {
            return true;
        }

        // Jika kedua cara gagal, return false
        return false;
    }

    private function handleSuccess($key, $userIp)
    {
        RateLimiter::clear($key);
        session()->regenerate();
    }

    private function handleFailed($key, $userIp)
    {
        RateLimiter::hit($key);
    }

    private function checkTooManyAttempts($key)
    {
        if (RateLimiter::tooManyAttempts($key, self::RATE_LIMIT_MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'message' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik."
            ]);
        }
    }

    private function getRedirectUrl()
    {
        $user = Auth::user();
        $userRole = $user->role;

        $dashboardRoutes = [
            'ROLE_SUPERADMIN' => 'super-admin.dashboard',
            'ROLE_KATIM' => 'katim.dashboard',
            'ROLE_KASUBAG_TU_UPDT' => 'kasubag.dashboard',
            'ROLE_KUPTD' => 'kuptd.dashboard',
            'ROLE_SEKDIN' => 'sekdin.dashboard',
            'ROLE_BENDAHARA' => 'bendahara.dashboard',
            'ROLE_KABID' => 'kabid.dashboard',
            'ROLE_PENDAFTAR' => 'pendaftar.dashboard',
        ];

        return $dashboardRoutes[$userRole] ?? 'login';
    }

    private function getRateLimitKey($ipAddress)
    {
        return 'login.' . $ipAddress;
    }
}
