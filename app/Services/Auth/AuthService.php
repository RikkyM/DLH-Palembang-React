<?php

namespace App\Services\Auth;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const RATE_LIMIT_MAX_ATTEMPTS = 20;

    public function processLogin($credentials, $userIp)
    {
        $rateLimitKey = $this->getRateLimitKey($userIp);
        $this->checkTooManyAttempts($rateLimitKey);

        $loginSuccess = $this->attemptLogin($credentials['login'], $credentials['password']);

        if ($loginSuccess) {
            $this->handleSuccess($rateLimitKey, $userIp);

            $user = Auth::user();

            if ($user) {
                $user->historyLogin = array_merge($user->historyLogin ?? [], [
                    Carbon::now()
                ]);

                $user->save();
            }

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
        if (Auth::attempt(['nip' => $loginField, 'password' => $password])) {
            return true;
        }

        if (Auth::attempt(['username' => $loginField, 'password' => $password])) {
            return true;
        }

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
