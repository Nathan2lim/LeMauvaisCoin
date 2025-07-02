<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class LoginCheckDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        
        // Schema pour la demande de connexion
        $schemas = $openApi->getComponents()->getSchemas();
        $schemas['LoginRequest'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'email' => [
                    'type' => 'string',
                    'format' => 'email',
                    'description' => 'Email de l\'utilisateur',
                ],
                'password' => [
                    'type' => 'string',
                    'description' => 'Mot de passe de l\'utilisateur',
                ],
            ],
            'required' => ['email', 'password'],
        ]);

        // Schema pour la réponse de connexion
        $schemas['LoginResponse'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'token' => [
                    'type' => 'string',
                    'example' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    'description' => 'JWT token pour l\'authentification',
                ],
            ],
        ]);

        // Ajout des schémas à OpenAPI
        $openApi = $openApi->withComponents(
            $openApi->getComponents()->withSchemas($schemas)
        );

        // Détail de l'opération de connexion
        $pathItem = new Model\PathItem(
            post: new Model\Operation(
                operationId: 'postLoginCheck',
                tags: ['Authentication'],
                responses: [
                    '200' => [
                        'description' => 'Connexion réussie',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/LoginResponse',
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'Identifiants invalides',
                    ],
                ],
                summary: 'Connexion d\'un utilisateur',
                description: 'Permet à un utilisateur de se connecter et d\'obtenir un token JWT',
                requestBody: new Model\RequestBody(
                    description: 'Identifiants de connexion',
                    required: true,
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/LoginRequest',
                            ],
                        ],
                    ])
                )
            )
        );

        // Ajout ou mise à jour du chemin à OpenAPI
        $openApi->getPaths()->addPath('/api/login_check', $pathItem);

        return $openApi;
    }
}
