package com.innohacks.repository;

import java.util.List;

import com.innohacks.domain.UserKnownWord;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Sentence entity.
 */
@Repository
public interface UserKnownWordsRepository extends MongoRepository<UserKnownWord, String> {
    List<UserKnownWord> findByUser(String user);
}
