<?php

namespace App\Repository;

use App\Entity\Ad;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ad>
 *
 * @method Ad|null find($id, $lockMode = null, $lockVersion = null)
 * @method Ad|null findOneBy(array $criteria, array $orderBy = null)
 * @method Ad[]    findAll()
 * @method Ad[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AdRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ad::class);
    }

    public function findPublishedAds(int $limit = 10, int $offset = 0): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.isPublished = :isPublished')
            ->setParameter('isPublished', true)
            ->orderBy('a.publishedAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function countPublishedAds(): int
    {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->andWhere('a.isPublished = :isPublished')
            ->setParameter('isPublished', true)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findByCategory(int $categoryId, int $limit = 10, int $offset = 0): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.category = :categoryId OR a.category IN (
                SELECT c.id FROM App\Entity\Category c WHERE c.parent = :categoryId
            )')
            ->andWhere('a.isPublished = :isPublished')
            ->setParameter('categoryId', $categoryId)
            ->setParameter('isPublished', true)
            ->orderBy('a.publishedAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }
}
