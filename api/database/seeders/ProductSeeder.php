<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Borsodi világos sör 0,5L',
                'price' => 350,
                'stock_count' => 150
            ],
            [
                'name' => 'Dreher classic sör 0,5L',
                'price' => 360,
                'stock_count' => 120
            ],
            [
                'name' => 'Magyar kenyér 800g',
                'price' => 380,
                'stock_count' => 100
            ],
            [
                'name' => 'Friss tehéntej 1L',
                'price' => 280,
                'stock_count' => 80
            ],
            [
                'name' => 'Csirkehús filé 500g',
                'price' => 1200,
                'stock_count' => 60
            ],
            [
                'name' => 'Alma 1kg',
                'price' => 400,
                'stock_count' => 90
            ],
            [
                'name' => 'Szénsavas ásványvíz 1,5L',
                'price' => 220,
                'stock_count' => 200
            ],
            [
                'name' => 'Trappista sajt 250g',
                'price' => 850,
                'stock_count' => 70
            ]
        ]);
    }
}
