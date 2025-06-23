<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\httpfoundation\JsonResponse;
use Symfony\Component\Security\Core\User\InMemoryUser;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class ApiKeyAuthenticator extends AbstractAuthenticator
{
    private const API_KEY_HEADER = 'X-API-KEY';

    public function supports(Request $request): ?bool
    {
        return $request->headers->has(self::API_KEY_HEADER);
    }

    public function authenticate(Request $request): Passport
    {
        $apiKey = $request->headers->get(self::API_KEY_HEADER);
        if ($apiKey !== $_ENV['EN_API_KEY']) {
            throw new AuthenticationException('Invalid API Key');
        }

        return new SelfValidatingPassport(new UserBadge('api_key_user', function () {
            return new InMemoryUser('api_key_user', null, ['ROLE_API']);
        }));
    }

    public function onAuthenticationSuccess(Request $request, $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(
            ['message' => 'API key invalide'],
            Response::HTTP_UNAUTHORIZED
        );
    }
}
