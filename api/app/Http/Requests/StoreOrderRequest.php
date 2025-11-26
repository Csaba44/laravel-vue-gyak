<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
    /* 'user_id',
        'postal_code',
        'address',
        'status'*/
    public function rules(): array
    {
        return [
            'postal_code' => 'required|string|regex:/^\d{4}$/',
            'address' => 'required',
            'products' => 'required|array|min:1',
            'status' => [Rule::in(['Megrendelve', 'Előkészítés alatt', 'Átadva a futárnak'])],
        ];
    }
}
