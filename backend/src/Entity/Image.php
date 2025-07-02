<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\Repository\ImageRepository;
use App\Traits\Times;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['image:read']]),
        new GetCollection(normalizationContext: ['groups' => ['image:read']]),
        new Post(denormalizationContext: ['groups' => ['image:write']]),
        new Delete()
    ],
    normalizationContext: ['groups' => ['image:read']],
    denormalizationContext: ['groups' => ['image:write']]
)]
#[ORM\Entity(repositoryClass: ImageRepository::class)]
class Image
{
    use Times;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['image:read', 'ad:read', 'ad:item:read'])]
    private ?int $id = null;

    #[Groups(['image:read', 'image:write', 'ad:read', 'ad:item:read'])]
    #[ORM\Column(length: 255)]
    private ?string $url = null;

    #[Groups(['image:read', 'image:write'])]
    #[ORM\Column]
    private ?int $position = null;

    #[Groups(['image:read', 'image:write'])]
    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ad $ad = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getAd(): ?Ad
    {
        return $this->ad;
    }

    public function setAd(?Ad $ad): static
    {
        $this->ad = $ad;

        return $this;
    }
}
