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
        $rateLimitKey = $this->getRateLimitKey($userIp);

        $this->checkTooManyAttempts($rateLimitKey);

        if (Auth::attempt($credentials)) {
            $this->handleSuccess($rateLimitKey, $userIp);
            return $this->getRedirectUrl();
        } else {
            $this->handleFailed($rateLimitKey, $userIp);
            throw ValidationException::withMessages([
                'message' => 'NIP atau Password salah.'
            ]);
        }
    }

    private function handleSuccess($key)
    {
        RateLimiter::clear($key);

        session()->regenerate();
    }

    private function handleFailed($key)
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
