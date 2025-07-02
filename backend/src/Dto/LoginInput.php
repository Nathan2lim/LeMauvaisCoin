<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class LoginInput
{
    #[Assert\NotBlank(message: "L'email ne peut pas être vide")]
    #[Assert\Email(message: "L'email n'est pas valide")]
    public string $email;

    #[Assert\NotBlank(message: "Le mot de passe ne peut pas être vide")]
    public string $password;
}
