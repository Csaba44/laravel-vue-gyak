<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //$orders = Order::all();
        $orders = Order::with(['user', 'products'])->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $data = [
            'user_id' => $request->user_id,
            'postal_code' => $request->postal_code,
            'address' => $request->address,
        ];

        // Only add 'status' field if it is in the request, else use default from migration
        if ($request->filled('status')) {
            $data['status'] = $request->status;
        }

        Order::create($data);

        return response()->json(["message" => 'Order created', "success" => true], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //$order = Order::find($id);
        $order = Order::with(['user', 'products'])->find($id); // Eager loading
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
