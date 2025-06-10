<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    /**
     * Display a listing of the listings.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $listings = Listing::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $listings,
            'message' => 'Listings retrieved successfully',
            'status' => 'success'
        ]);
    }

    /**
     * Store a newly created listing in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'price' => 'required|numeric|min:0',
            'location' => 'nullable|string',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string',
        ]);

        $listing = Listing::create($validated);

        return response()->json([
            'data' => $listing,
            'message' => 'Listing created successfully',
            'status' => 'success'
        ], 201);
    }

    /**
     * Display the specified listing.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $listing = Listing::findOrFail($id);

        return response()->json([
            'data' => $listing,
            'message' => 'Listing retrieved successfully',
            'status' => 'success'
        ]);
    }
}
