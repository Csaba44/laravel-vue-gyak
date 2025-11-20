<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('order_product')->insert([
            [
                'order_id' => 1,
                'product_id' => 1,
                'count' => 1,
            ],
            [
                'order_id' => 1,
                'product_id' => 2,
                'count' => 3,
            ]
        ]);
    }
}
