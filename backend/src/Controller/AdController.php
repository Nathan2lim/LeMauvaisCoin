<?php

namespace App\Controller;

use App\Entity\Ad;
use App\Entity\Image;
use App\Entity\Category;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AdController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ValidatorInterface $validator;
    private string $uploadsDirectory;

    public function __construct(
        EntityManagerInterface $entityManager, 
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->uploadsDirectory = 'public/uploads';
    }

    #[Route('/ads', name: 'api_ads_post', methods: ['POST'])]
    public function createAd(Request $request): JsonResponse
    {
        try {
            // Get form data
            $title = $request->request->get('title');
            $description = $request->request->get('description');
            $price = $request->request->get('price');
            $city = $request->request->get('city');
            $zipcode = $request->request->get('zipcode');
            $categoryId = $request->request->get('category');
            $userId = $request->request->get('user', 1); // Default to user 1 for now

            // Validate required fields
            if (!$title || !$description || !$price || !$city || !$zipcode || !$categoryId) {
                return $this->json([
                    'error' => 'Missing required fields',
                    'required' => ['title', 'description', 'price', 'city', 'zipcode', 'category']
                ], Response::HTTP_BAD_REQUEST);
            }

            // Get entities
            $category = $this->entityManager->getRepository(Category::class)->find($categoryId);
            if (!$category) {
                return $this->json(['error' => 'Category not found'], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->entityManager->getRepository(User::class)->find($userId);
            if (!$user) {
                return $this->json(['error' => 'User not found'], Response::HTTP_BAD_REQUEST);
            }

            // Create Ad entity
            $ad = new Ad();
            $ad->setTitle($title);
            $ad->setDescription($description);
            $ad->setPrice($price);
            $ad->setCity($city);
            $ad->setZipcode($zipcode);
            $ad->setCategory($category);
            $ad->setUser($user);
            $ad->setIsPublished(true);

            // Validate the ad
            $errors = $this->validator->validate($ad);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            // Persist the ad first
            $this->entityManager->persist($ad);
            $this->entityManager->flush();

            // Handle file uploads
            $uploadedFiles = $request->files->get('images', []);
            if (!is_array($uploadedFiles)) {
                $uploadedFiles = [$uploadedFiles];
            }

            $imageUrls = [];
            $position = 1;

            foreach ($uploadedFiles as $uploadedFile) {
                if ($uploadedFile instanceof UploadedFile && $uploadedFile->isValid()) {
                    $url = $this->handleFileUpload($uploadedFile, $ad, $position);
                    if ($url) {
                        $imageUrls[] = $url;
                        $position++;
                    }
                }
            }

            $this->entityManager->flush();

            return $this->json([
                'id' => $ad->getId(),
                'title' => $ad->getTitle(),
                'description' => $ad->getDescription(),
                'price' => $ad->getPrice(),
                'city' => $ad->getCity(),
                'zipcode' => $ad->getZipcode(),
                'images' => $imageUrls,
                'category' => [
                    'id' => $category->getId(),
                    'name' => $category->getName()
                ],
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail()
                ],
                'createdAt' => $ad->getCreatedAt()->format('Y-m-d H:i:s'),
                'isPublished' => $ad->isIsPublished()
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to create ad',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function handleFileUpload(UploadedFile $file, Ad $ad, int $position): ?string
    {
        // Validate file type
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
            return null;
        }

        // Generate unique filename
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
        $fileName = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        // Create upload directory if it doesn't exist
        $uploadDir = $this->getParameter('kernel.project_dir').'/'.$this->uploadsDirectory.'/images';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        try {
            // Move the file
            $file->move($uploadDir, $fileName);

            // Create Image entity
            $image = new Image();
            $image->setUrl('/uploads/images/'.$fileName);
            $image->setPosition($position);
            $image->setAd($ad);

            $this->entityManager->persist($image);

            return $image->getUrl();

        } catch (\Exception $e) {
            return null;
        }
    }

    #[Route('/uploads/images/{filename}', name: 'serve_image', methods: ['GET'])]
    public function serveImage(string $filename): Response
    {
        $imagePath = $this->getParameter('kernel.project_dir').'/public/uploads/images/'.$filename;
        
        if (!file_exists($imagePath)) {
            throw $this->createNotFoundException('Image not found');
        }

        $mimeType = mime_content_type($imagePath);
        if (!str_starts_with($mimeType, 'image/')) {
            throw $this->createNotFoundException('File is not an image');
        }

        return new Response(
            file_get_contents($imagePath),
            200,
            [
                'Content-Type' => $mimeType,
                'Cache-Control' => 'public, max-age=3600'
            ]
        );
    }
}
