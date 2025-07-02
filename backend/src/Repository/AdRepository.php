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

    /**
     * Recherche avancée dans les annonces basée sur un terme de recherche
     * Recherche dans le titre et la description avec une priorité sur le titre
     *
     * @param string $searchTerm Le terme à rechercher
     * @param int $limit Nombre maximum de résultats
     * @param int $offset Décalage pour la pagination
     * @param bool $onlyPublished Si true, retourne uniquement les annonces publiées
     * @return array Les annonces correspondantes
     */
    public function advancedSearch(string $searchTerm, int $limit = 10, int $offset = 0, bool $onlyPublished = true): array
    {
        $qb = $this->createQueryBuilder('a');
        
        // Condition pour trouver les correspondances dans le titre ou la description
        $qb->where(
            $qb->expr()->orX(
                $qb->expr()->like('LOWER(a.title)', ':searchTerm'),
                $qb->expr()->like('LOWER(a.description)', ':searchTerm')
            )
        )
        ->setParameter('searchTerm', '%' . strtolower($searchTerm) . '%');
        
        // Filtrer par annonces publiées si demandé
        if ($onlyPublished) {
            $qb->andWhere('a.isPublished = :isPublished')
               ->setParameter('isPublished', true);
        }
        
        // Trier les résultats : d'abord les correspondances dans le titre, puis par date de publication
        $qb->orderBy('CASE WHEN LOWER(a.title) LIKE :exactMatch THEN 1 ' .
                     'WHEN LOWER(a.title) LIKE :startMatch THEN 2 ' .
                     'WHEN LOWER(a.title) LIKE :containsMatch THEN 3 ' .
                     'ELSE 4 END', 'ASC')
           ->addOrderBy('a.publishedAt', 'DESC')
           ->setParameter('exactMatch', '%' . strtolower($searchTerm) . '%')
           ->setParameter('startMatch', strtolower($searchTerm) . '%')
           ->setParameter('containsMatch', '%' . strtolower($searchTerm) . '%');
        
        return $qb->setMaxResults($limit)
                  ->setFirstResult($offset)
                  ->getQuery()
                  ->getResult();
    }
    
    /**
     * Compte le nombre total d'annonces correspondant à une recherche
     *
     * @param string $searchTerm Le terme à rechercher
     * @param bool $onlyPublished Si true, compte uniquement les annonces publiées
     * @return int Le nombre d'annonces correspondantes
     */
    public function countAdvancedSearch(string $searchTerm, bool $onlyPublished = true): int
    {
        $qb = $this->createQueryBuilder('a')
            ->select('COUNT(a.id)');
        
        // Condition pour trouver les correspondances dans le titre ou la description
        $qb->where(
            $qb->expr()->orX(
                $qb->expr()->like('LOWER(a.title)', ':searchTerm'),
                $qb->expr()->like('LOWER(a.description)', ':searchTerm')
            )
        )
        ->setParameter('searchTerm', '%' . strtolower($searchTerm) . '%');
        
        // Filtrer par annonces publiées si demandé
        if ($onlyPublished) {
            $qb->andWhere('a.isPublished = :isPublished')
               ->setParameter('isPublished', true);
        }
        
        return (int) $qb->getQuery()
                        ->getSingleScalarResult();
    }
}
