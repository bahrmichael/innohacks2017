package com.innohacks.repository;

import java.util.Optional;

import com.innohacks.domain.Sentence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Sentence entity.
 */
@Repository
public interface SentenceRepository extends MongoRepository<Sentence, String> {
    Page<Sentence> findOneActiveOldest(Pageable pageable);

    Optional<Sentence> findOneByFirstLanguage(String first);
    Optional<Sentence> findOneBySecondLanguage(String first);
}
