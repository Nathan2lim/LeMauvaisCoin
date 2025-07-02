<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use App\Repository\AdRepository;
use App\Traits\Times;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['ad:read', 'ad:item:read']]),
        new GetCollection(normalizationContext: ['groups' => ['ad:read']]),
        new Put(denormalizationContext: ['groups' => ['ad:write']]),
        new Delete()
    ],
    normalizationContext: ['groups' => ['ad:read']],
    denormalizationContext: ['groups' => ['ad:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'partial',
    'description' => 'partial',
    'city' => 'partial',
    'zipcode' => 'partial',
    'category' => 'exact',
    'category.parent' => 'exact'
])]
#[ApiFilter(OrderFilter::class, properties: ['price', 'createdAt', 'publishedAt'])]
#[ApiFilter(BooleanFilter::class, properties: ['isPublished'])]
#[ApiFilter(RangeFilter::class, properties: ['price'])]
#[ORM\Entity(repositoryClass: AdRepository::class)]
class Ad
{
    use Times;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ad:read'])]
    private ?int $id = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Groups(['ad:read', 'ad:write', 'ad:item:read'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\Column(length: 255)]
    private ?string $city = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\Column(length: 10)]
    private ?string $zipcode = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\Column(options: ["default" => false])]
    private bool $isPublished = false;

    #[Groups(['ad:read'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $publishedAt = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\ManyToOne(inversedBy: 'ads')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups(['ad:read', 'ad:write'])]
    #[ORM\ManyToOne(inversedBy: 'ads')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;
    
    #[Groups(['ad:read', 'ad:write', 'ad:item:read'])]
    #[ORM\OneToMany(mappedBy: 'ad', targetEntity: Image::class, orphanRemoval: true)]
    #[ORM\OrderBy(["position" => "ASC"])]
    private Collection $images;

    public function __construct()
    {
        $this->images = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): static
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function isIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): static
    {
        $this->isPublished = $isPublished;
        
        if ($isPublished && $this->publishedAt === null) {
            $this->publishedAt = new \DateTime();
        }

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeInterface
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeInterface $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setAd($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getAd() === $this) {
                $image->setAd(null);
            }
        }

        return $this;
    }
}
