package com.innohacks.repository;

import java.util.Optional;

import com.innohacks.domain.Sentence;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Sentence entity.
 */
@Repository
public interface SentenceRepository extends MongoRepository<Sentence, String> {
    Optional<Sentence> findOneByFirstLanguage(String sentence);
    Optional<Sentence> findOneBySecondLanguage(String sentence);
}
