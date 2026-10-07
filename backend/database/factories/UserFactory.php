<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'remarks' => fake()->sentence(),
            'must_change_password' => true,
            'active' => true,
            'employment_start_date' => fake()->date(),
            'role_id' => null,
            'department_id' => null,
            'user_credit_id' => null,
        ];
    }
}
