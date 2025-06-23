<?php

namespace App\EventListener;

use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\Mapping\ClassMetadata;
use ReflectionClass;

#[AsDoctrineListener(event: Events::loadClassMetadata)]
class SoftDeleteSubscriber 
{
    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs): void
    {
        $metadata = $eventArgs->getClassMetadata();
        $reflClass = new ReflectionClass($metadata->getName());
        
        // Vérifier si la classe utilise le trait Times
        $hasDeletedAt = $this->hasDeletedAtProperty($reflClass);
        
        if (!$hasDeletedAt) {
            return;
        }
        
        // On s'assure que le champ deletedAt est bien configuré
        if (!$metadata->hasField('deletedAt')) {
            // Si le champ n'existe pas déjà dans les mappings, on l'ajoute
            $metadata->mapField([
                'fieldName' => 'deletedAt',
                'columnName' => 'deleted_at',
                'type' => 'datetime',
                'nullable' => true,
            ]);
        }
    }
    
    /**
     * Vérifie si la classe ou l'un de ses traits a une propriété deletedAt
     */
    private function hasDeletedAtProperty(ReflectionClass $class): bool
    {
        // Vérifier si la classe elle-même a la propriété
        if ($class->hasProperty('deletedAt')) {
            return true;
        }
        
        // Vérifier si l'un des traits utilisés a la propriété
        $traits = $class->getTraits();
        foreach ($traits as $trait) {
            if ($trait->hasProperty('deletedAt')) {
                return true;
            }
            
            // Vérifier récursivement les traits du trait
            if ($this->hasDeletedAtProperty($trait)) {
                return true;
            }
        }
        
        // Vérifier la classe parente
        $parentClass = $class->getParentClass();
        if ($parentClass) {
            return $this->hasDeletedAtProperty($parentClass);
        }
        
        return false;
    }
}