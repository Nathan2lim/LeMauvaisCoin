<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class RegisterOpenApiDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        
        // Schema pour la demande d'inscription
        $schemas = $openApi->getComponents()->getSchemas();
        $schemas['RegisterRequest'] = new \ArrayObject([
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
                'name' => [
                    'type' => 'string',
                    'description' => 'Nom complet de l\'utilisateur',
                ],
                'phone' => [
                    'type' => 'string',
                    'description' => 'Numéro de téléphone (optionnel)',
                ],
            ],
            'required' => ['email', 'password', 'name'],
        ]);

        // Schema pour la réponse d'inscription
        $schemas['RegisterResponse'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'message' => [
                    'type' => 'string',
                    'example' => 'Utilisateur créé avec succès',
                ],
            ],
        ]);

        // Ajout des schémas à OpenAPI
        $openApi = $openApi->withComponents(
            $openApi->getComponents()->withSchemas($schemas)
        );

        // Détail de l'opération d'inscription
        $pathItem = new Model\PathItem(
            post: new Model\Operation(
                operationId: 'postRegister',
                tags: ['Authentication'],
                responses: [
                    '201' => [
                        'description' => 'Utilisateur créé avec succès',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/RegisterResponse',
                                ],
                            ],
                        ],
                    ],
                    '400' => [
                        'description' => 'Données invalides',
                    ],
                    '409' => [
                        'description' => 'Email déjà utilisé',
                    ],
                ],
                summary: 'Inscription d\'un nouvel utilisateur',
                description: 'Permet à un utilisateur de créer un compte',
                requestBody: new Model\RequestBody(
                    description: 'Données d\'inscription de l\'utilisateur',
                    required: true,
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/RegisterRequest',
                            ],
                        ],
                    ])
                )
            )
        );

        // Ajout du chemin à OpenAPI
        $openApi->getPaths()->addPath('/api/register', $pathItem);

        return $openApi;
    }
}
