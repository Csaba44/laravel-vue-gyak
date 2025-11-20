<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use function PHPSTORM_META\map;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'stock_count'
    ];

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class)->withPivot('count');
    }
}
