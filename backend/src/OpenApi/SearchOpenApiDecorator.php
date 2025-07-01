<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class SearchOpenApiDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();

        // Ajouter le schéma de réponse de recherche
        $schemas['SearchResponse'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'total' => [
                    'type' => 'integer',
                    'example' => 42,
                    'description' => 'Le nombre total de résultats'
                ],
                'items' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string'],
                            'price' => ['type' => 'string'],
                            'city' => ['type' => 'string'],
                            'zipcode' => ['type' => 'string'],
                            'isPublished' => ['type' => 'boolean'],
                            'publishedAt' => ['type' => 'string', 'format' => 'date-time'],
                            'createdAt' => ['type' => 'string', 'format' => 'date-time'],
                            'updatedAt' => ['type' => 'string', 'format' => 'date-time']
                        ]
                    ],
                    'description' => 'Les annonces correspondant à la recherche'
                ],
                'limit' => [
                    'type' => 'integer',
                    'example' => 10,
                    'description' => 'Le nombre maximum de résultats retournés'
                ],
                'offset' => [
                    'type' => 'integer',
                    'example' => 0,
                    'description' => 'L\'index de départ pour la pagination'
                ],
                'query' => [
                    'type' => 'string',
                    'example' => 'voiture',
                    'description' => 'Le terme de recherche utilisé'
                ]
            ]
        ]);

        // Définir explicitement le chemin de l'API de recherche
        $searchPath = new Model\PathItem(
            ref: 'Search',
            get: new Model\Operation(
                operationId: 'searchAds',
                tags: ['Search'],
                summary: 'Recherche dans les annonces',
                description: 'Recherche les annonces contenant les termes spécifiés dans le titre ou la description',
                parameters: [
                    new Model\Parameter(
                        name: 'q',
                        in: 'query',
                        description: 'Terme de recherche pour les annonces (dans le titre ou la description)',
                        required: true,
                        schema: [
                            'type' => 'string'
                        ]
                    ),
                    new Model\Parameter(
                        name: 'limit',
                        in: 'query',
                        description: 'Nombre maximum d\'annonces à retourner',
                        required: false,
                        schema: [
                            'type' => 'integer',
                            'default' => 10
                        ]
                    ),
                    new Model\Parameter(
                        name: 'offset',
                        in: 'query',
                        description: 'Décalage pour la pagination',
                        required: false,
                        schema: [
                            'type' => 'integer',
                            'default' => 0
                        ]
                    ),
                    new Model\Parameter(
                        name: 'onlyPublished',
                        in: 'query',
                        description: 'Si true, retourne uniquement les annonces publiées',
                        required: false,
                        schema: [
                            'type' => 'boolean',
                            'default' => true
                        ]
                    )
                ],
                responses: [
                    '200' => [
                        'description' => 'Liste des annonces correspondant aux critères de recherche',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/SearchResponse'
                                ]
                            ]
                        ]
                    ],
                    '400' => [
                        'description' => 'Paramètres de recherche invalides',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'message' => [
                                            'type' => 'string',
                                            'example' => 'Le paramètre de recherche "q" est requis'
                                        ],
                                        'code' => [
                                            'type' => 'string',
                                            'example' => 'SEARCH_TERM_REQUIRED'
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            )
        );

        $openApi->getPaths()->addPath('/api/search', $searchPath);

        return $openApi;
    }
}
