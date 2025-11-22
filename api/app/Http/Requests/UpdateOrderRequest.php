<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'postal_code' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
            'status' => ['sometimes', Rule::in(['Megrendelve', 'Előkészítés alatt', 'Átadva a futárnak'])],
            
            
            'products' => 'sometimes|required|array|min:1',
            'products.*.product_id' => 'required_with:products|exists:products,id',
            'products.*.count' => 'required_with:products|integer|min:1',
        ];
    }
}
