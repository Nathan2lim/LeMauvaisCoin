<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ListingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing listings
        DB::table('listings')->truncate();
        
        $faker = Faker::create('fr_FR');
        
        // Create 20 sample listings
        for ($i = 0; $i < 20; $i++) {
            Listing::create([
                'title' => $faker->sentence(rand(3, 6), true),
                'description' => $faker->paragraphs(rand(2, 5), true),
                'price' => $faker->randomFloat(2, 10, 2000),
                'location' => $faker->city,
                'contact_email' => $faker->email,
                'contact_phone' => $faker->phoneNumber,
                'status' => $faker->randomElement(['active', 'pending', 'sold']),
                'created_at' => $faker->dateTimeBetween('-1 month', 'now'),
                'updated_at' => $faker->dateTimeBetween('-1 month', 'now'),
            ]);
        }
    }
}
