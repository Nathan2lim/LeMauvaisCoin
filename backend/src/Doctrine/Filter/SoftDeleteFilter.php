<?php

namespace App\Doctrine\Filter;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

class SoftDeleteFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias)
    {
        // Check if the entity has deletedAt field
        if (!$targetEntity->hasField('deletedAt')) {
            return '';
        }

        return $targetTableAlias . '.deleted_at IS NULL';
    }
}
