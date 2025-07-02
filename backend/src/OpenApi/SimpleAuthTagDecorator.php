<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class SimpleAuthTagDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $paths = $openApi->getPaths();
        
        // Ajouter documentation pour /api/login_check
        $loginCheckPath = '/api/login_check';
        $loginOperation = (new Model\Operation())
            ->withOperationId('postLoginCheck')
            ->withTags(['Authentication'])
            ->withSummary('Authentifier un utilisateur')
            ->withDescription('Permet à un utilisateur de se connecter et d\'obtenir un token JWT')
            ->withRequestBody(
                new Model\RequestBody(
                    description: 'Identifiants de connexion',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'email' => ['type' => 'string', 'example' => 'user@example.com'],
                                    'password' => ['type' => 'string', 'example' => 'password']
                                ],
                                'required' => ['email', 'password']
                            ]
                        ]
                    ]),
                    required: true
                )
            )
            ->withResponses([
                '200' => [
                    'description' => 'Token JWT généré',
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'token' => ['type' => 'string']
                                ]
                            ]
                        ]
                    ]
                ],
                '401' => ['description' => 'Identifiants invalides']
            ]);
        
        $loginPathItem = new Model\PathItem(
            post: $loginOperation
        );
        
        // Ajouter ou mettre à jour le chemin /api/login_check
        $paths->addPath($loginCheckPath, $loginPathItem);
        
        // Mettre à jour les chemins dans l'OpenApi
        $openApi = $openApi->withPaths($paths);
        
        return $openApi;
    }
}
