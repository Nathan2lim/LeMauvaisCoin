<?php
namespace App\Traits;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use DateTimeInterface;

trait Times
{
    #[Gedmo\Timestampable(on: "create")]
    #[ORM\Column(name: "created_at", type: "datetime", nullable: true)]
    private ?DateTimeInterface $createdAt = null;

    #[Gedmo\Timestampable(on: "update")]
    #[ORM\Column(name: "updated_at", type: "datetime", nullable: true)]
    private ?DateTimeInterface $updatedAt = null;
    
    /**
     * Date de suppression pour le soft delete
     * Une entité est considérée comme supprimée quand cette propriété n'est pas null
     * et que sa valeur est inférieure ou égale à la date courante
     */
    #[ORM\Column(name: "deleted_at", type: "datetime", nullable: true)]
    private ?DateTimeInterface $deletedAt = null;

    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?DateTimeInterface
    {
        return $this->updatedAt;
    }
    
    public function getDeletedAt(): ?DateTimeInterface
    {
        return $this->deletedAt;
    }

    public function setCreatedAt(?DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function setUpdatedAt(?DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
    
    public function setDeletedAt(?DateTimeInterface $deletedAt): self
    {
        $this->deletedAt = $deletedAt;
        
        return $this;
    }
    
    /**
     * Vérifie si l'entité est supprimée logiquement
     */
    public function isDeleted(): bool
    {
        if ($this->deletedAt === null) {
            return false;
        }
        
        return $this->deletedAt <= new \DateTime();
    }
    
    /**
     * Marque l'entité comme supprimée à la date actuelle
     */
    public function delete(): self
    {
        $this->deletedAt = new \DateTime();
        
        return $this;
    }
    
    /**
     * Restaure l'entité supprimée
     */
    public function restore(): self
    {
        $this->deletedAt = null;
        
        return $this;
    }
}