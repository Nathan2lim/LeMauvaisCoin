<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * Get API status
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'message' => 'LeMauvaisCoin API is running3!',
            'status' => 'success',
            'timestamp' => now()->toDateTimeString()
        ]);
    }
}
