<?php

namespace App\Repository;

use App\Entity\Image;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Image>
 *
 * @method Image|null find($id, $lockMode = null, $lockVersion = null)
 * @method Image|null findOneBy(array $criteria, array $orderBy = null)
 * @method Image[]    findAll()
 * @method Image[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Image::class);
    }

    public function getNextPosition(int $adId): int
    {
        $result = $this->createQueryBuilder('i')
            ->select('MAX(i.position) as maxPosition')
            ->andWhere('i.ad = :adId')
            ->setParameter('adId', $adId)
            ->getQuery()
            ->getOneOrNullResult();
        
        return ($result['maxPosition'] ?? 0) + 1;
    }
}
