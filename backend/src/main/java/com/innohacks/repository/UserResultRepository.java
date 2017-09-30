package com.innohacks.repository;

import java.util.List;
import java.util.Optional;

import com.innohacks.domain.Sentence;
import com.innohacks.domain.UserResult;
import com.innohacks.domain.UserResultStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Sentence entity.
 */
@Repository
public interface UserResultRepository extends MongoRepository<UserResult, String> {
    Optional<UserResult> findOneBySentenceId(String sentenceId);

    List<UserResult> findByStatus(UserResultStatus status);

    Optional<UserResult> findOneBySentenceIdAndUser(String sentenceId, String user);

    int countByUserAndStatus(String user, UserResultStatus status);
}
