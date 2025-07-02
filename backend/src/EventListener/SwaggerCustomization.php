<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Class SwaggerCustomization
 * This class customizes the Swagger UI interface.
 */
class SwaggerCustomization implements EventSubscriberInterface
{
    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 0],
        ];
    }

    /**
     * Customize Swagger UI on kernel request.
     *
     * @param RequestEvent $event
     * @return void
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $route = $request->attributes->get('_route');

        // Only modify Swagger UI related routes
        if ($route === 'api_doc' || $route === 'api_doc_json') {
            // Here you can add logic to customize Swagger UI 
            // For example, modify request attributes or headers
        }
    }
}
