<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;

class ApiController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/status', name: 'status', methods: ['GET'])]
    public function status(): JsonResponse
    {
        $data = [
            'status' => 'active',
            'message' => 'API Symfony fonctionnelle !',
            'timestamp' => (new \DateTime())->format('Y-m-d H:i:s'),
            'version' => '1.0.0',
            'environment' => $this->getParameter('kernel.environment'),
            'server' => [
                'php_version' => PHP_VERSION,
                'symfony_version' => \Symfony\Component\HttpKernel\Kernel::VERSION,
            ]
        ];

        return $this->json($data, Response::HTTP_OK);
    }

    #[Route('/health', name: 'health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        // Check database connection
        $dbStatus = 'connected';
        try {
            $connection = $this->entityManager->getConnection();
            $connection->connect();
            if (!$connection->isConnected()) {
                $dbStatus = 'disconnected';
            }
        } catch (\Exception $e) {
            $dbStatus = 'error: ' . $e->getMessage();
        }

        $data = [
            'status' => $dbStatus === 'connected' ? 'healthy' : 'unhealthy',
            'checks' => [
                'database' => $dbStatus,
                'memory_usage' => memory_get_usage(true),
                'uptime' => $this->getUptime()
            ],
            'timestamp' => (new \DateTime())->format('Y-m-d H:i:s')
        ];

        $statusCode = $dbStatus === 'connected' ? Response::HTTP_OK : Response::HTTP_SERVICE_UNAVAILABLE;
        
        return $this->json($data, $statusCode);
    }

    private function getUptime(): string
    {
        $uptime = time() - $_SERVER['REQUEST_TIME_FLOAT'];
        return number_format($uptime, 2) . ' seconds';
    }
}
