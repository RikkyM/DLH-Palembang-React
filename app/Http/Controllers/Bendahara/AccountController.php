<?php

namespace App\Http\Controllers\Bendahara;

use App\Http\Controllers\Controller;
use App\Http\Requests\AkunRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Bendahara/Akun', [
            'userData' => $user,
            'role' => $user->role
        ]);
    }

    public function update(AkunRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();

        $user->fill(collect($data)->except(['password', 'password_confirmation'])->toArray());

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return back()->with('success', 'Akun berhasil diperbarui.');
    }
}
