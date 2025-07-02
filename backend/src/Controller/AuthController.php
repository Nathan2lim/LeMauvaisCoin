<?php

namespace App\Controller;

use App\Dto\LoginInput;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Entity\User;
use OpenApi\Attributes as OA;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/register',
            controller: self::class,
            name: 'register',
            openapi: new \ApiPlatform\OpenApi\Model\Operation(
                tags: ['Authentication']
            )
        )
    ]
)]
class AuthController extends AbstractController
{
    #[OA\Tag(name: 'Authentication')]
    #[OA\RequestBody(
        description: 'Données d\'inscription d\'un nouvel utilisateur',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'email', type: 'string'),
                new OA\Property(property: 'password', type: 'string'),
                new OA\Property(property: 'name', type: 'string'),
                new OA\Property(property: 'phone', type: 'string')
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Utilisateur créé avec succès'
    )]
    #[OA\Response(
        response: 400,
        description: 'Données invalides'
    )]
    #[OA\Response(
        response: 409,
        description: 'Email déjà utilisé'
    )]
    public function __invoke(
        \Symfony\Component\HttpFoundation\Request $request,
        \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $passwordHasher,
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \Symfony\Component\Validator\Validator\ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérifier les champs requis
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
            return $this->json([
                'message' => 'Les champs email, password et name sont requis',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'email existe déjà
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json([
                'message' => 'Cet email est déjà utilisé',
            ], Response::HTTP_CONFLICT);
        }

        // Créer le nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);
        $user->setName($data['name']);
        
        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }

        // Hasher le mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Valider l'entité
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            
            return $this->json([
                'message' => 'Validation failed',
                'errors' => $errorMessages,
            ], Response::HTTP_BAD_REQUEST);
        }

        // Sauvegarder l'utilisateur
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Utilisateur créé avec succès',
        ], Response::HTTP_CREATED);
    }
    
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[OA\Tag(name: 'Authentication')]
    #[OA\Response(
        response: 200,
        description: 'Retourne les informations de l\'utilisateur connecté'
    )]
    #[OA\Response(
        response: 401,
        description: 'Pas d\'utilisateur connecté'
    )]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'message' => 'Vous n\'êtes pas connecté',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'roles' => $user->getRoles(),
        ]);
    }
}
