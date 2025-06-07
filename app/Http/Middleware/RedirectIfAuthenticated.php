<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return $this->redirectBasedOnRole(Auth::user()->role);
            }
        }

        return $next($request);
    }

    private function redirectBasedOnRole($role)
    {
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

        $routeName = $dashboardRoutes[$role] ?? 'login';

        return redirect()->route($routeName);
    }
}
