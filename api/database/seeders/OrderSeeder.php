<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            'user_id' => 1,
            'postal_code' => 1234,
            'address' => 'Kossuth u. 1',
            'status' => 'Megrendelve'
        ]);
    }
}
