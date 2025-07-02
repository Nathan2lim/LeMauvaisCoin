<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class AuthTagsDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        
        // Liste des tags que nous voulons unifier sous "Authentication"
        $tagsToUnify = ['AuthController', 'Login Check'];
        
        // Parcourir tous les chemins et opérations
        $paths = $openApi->getPaths();
        
        foreach ($paths->getPaths() as $path => $pathItem) {
            foreach (['get', 'post', 'put', 'patch', 'delete'] as $method) {
                $operation = $pathItem->{'get'.ucfirst($method)}();
                
                if (null !== $operation) {
                    $tags = $operation->getTags();
                    
                    // Si l'opération a un des tags à unifier ou si c'est un endpoint d'authentification
                    if (
                        count(array_intersect($tags, $tagsToUnify)) > 0 ||
                        strpos($path, '/api/login_check') !== false ||
                        strpos($path, '/api/register') !== false
                    ) {
                        // Remplacer tous les tags par "Authentication"
                        $newTags = ['Authentication'];
                        $operation = $operation->withTags($newTags);
                        $pathItem = $pathItem->{'with'.ucfirst($method)}($operation);
                        $paths->addPath($path, $pathItem);
                    }
                }
            }
        }
        
        // Mettre à jour les chemins dans l'OpenApi
        return $openApi->withPaths($paths);
    }
}
