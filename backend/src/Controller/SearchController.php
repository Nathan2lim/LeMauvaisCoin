<?php

namespace App\Controller;

use App\Repository\AdRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/search',
            controller: self::class,
            description: 'Recherche des annonces basée sur des termes dans le titre ou la description',
            name: 'search'
        )
    ]
)]
class SearchController extends AbstractController
{
    # Pas besoin de cette annotation Route car l'API Platform gère déjà le routage
# [Route('/search', name: 'api_search', methods: ['GET'])]
    #[OA\Tag(name: 'Search')]
    #[OA\Parameter(
        name: 'q',
        in: 'query',
        description: 'Terme de recherche pour les annonces (dans le titre ou la description)',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'limit',
        in: 'query',
        description: 'Nombre maximum d\'annonces à retourner',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 10)
    )]
    #[OA\Parameter(
        name: 'offset',
        in: 'query',
        description: 'Décalage pour la pagination',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 0)
    )]
    #[OA\Parameter(
        name: 'onlyPublished',
        in: 'query',
        description: 'Si true, retourne uniquement les annonces publiées',
        required: false,
        schema: new OA\Schema(type: 'boolean', default: true)
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des annonces correspondant aux critères de recherche',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'total', type: 'integer'),
                new OA\Property(property: 'items', type: 'array', items: new OA\Items())
            ]
        )
    )]
    public function __invoke(
        Request $request,
        AdRepository $adRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        // Récupération des paramètres
        $searchTerm = $request->query->get('q', '');
        $limit = min(50, max(1, $request->query->getInt('limit', 10))); // Limiter entre 1 et 50
        $offset = max(0, $request->query->getInt('offset', 0)); // Minimum 0
        $onlyPublished = $request->query->getBoolean('onlyPublished', true);
        
        // Vérification que le terme de recherche n'est pas vide
        if (empty($searchTerm)) {
            return $this->json([
                'message' => 'Le paramètre de recherche "q" est requis',
                'code' => 'SEARCH_TERM_REQUIRED'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        // Effectuer la recherche
        $ads = $adRepository->advancedSearch($searchTerm, $limit, $offset, $onlyPublished);
        $total = $adRepository->countAdvancedSearch($searchTerm, $onlyPublished);
        
        // Sérialiser les résultats avec les groupes de normalisation appropriés
        $serializedAds = $serializer->serialize($ads, 'json', ['groups' => ['ad:read']]);
        
        // Construction de la réponse
        $response = new JsonResponse([
            'total' => $total,
            'items' => json_decode($serializedAds, true),
            'limit' => $limit,
            'offset' => $offset,
            'query' => $searchTerm
        ]);
        
        // Ajouter des en-têtes pour le cache
        $response->setMaxAge(60); // Cache pendant 1 minute
        $response->setPublic();
        
        return $response;
    }
}
