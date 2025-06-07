<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = Auth::user()->role;

        if (!in_array($userRole, $roles)) {
            return $this->redirectBasedOnROle($userRole);
        }

        return $next($request);
    }

    private function redirectBasedOnROle($role)
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
