<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        if (!$user || !in_array($user->role, $roles)) {
            return match ($user->role) {
                'ROLE_SUPERADMIN' => to_route('super-admin.dashboard'),
                'ROLE_KATIM' => to_route('katim.dashboard'),
                'ROLE_KASUBAG_TU_UPDT' => to_route('kasubag.dashboard'),
                'ROLE_KUPTD' => to_route('kuptd.dashboard'),
                'ROLE_SEKDIN' => to_route('sekdin.dashboard'),
                'ROLE_BENDAHARA' => to_route('bendahara.dashboard'),
                'ROLE_KABID' => to_route('kabid.dashboard'),
                'ROLE_PENDAFTAR' => to_route('pendaftar.dashboard'),
                default => redirect('/')
            };
        }

        return $next($request);
    }
}
