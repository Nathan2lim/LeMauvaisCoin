<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserCustomController extends AbstractController
{
    public function __invoke(User $data): JsonResponse
    {
        // $data contient l'instance User récupérée par l'id dans l'URL
        
        // Exemple de logique personnalisée
        return $this->json([
            'message' => 'Compte vérifié',
            'user' => [
                'id' => $data->getId(),
                'email' => $data->getEmail(),
                'name' => $data->getName()
            ]
        ]);
    }
}
