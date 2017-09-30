package com.innohacks.service;

import java.util.Optional;

import com.innohacks.domain.UserResult;
import com.innohacks.domain.UserResultStatus;
import com.innohacks.repository.UserResultRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserResultService {

    private final Logger log = LoggerFactory.getLogger(UserResultService.class);

    private final UserResultRepository userResultRepository;

    public UserResultService(final UserResultRepository userResultRepository) {
        this.userResultRepository = userResultRepository;
    }

    public void update(final String user, final String sentenceId, final UserResultStatus status) {
        Optional<UserResult> oneBySentenceId = userResultRepository.findOneBySentenceIdAndUser(sentenceId, user);
        UserResult userResult;
        if (oneBySentenceId.isPresent()) {
            userResult = oneBySentenceId.get();
            userResult.setStatus(status);
        } else {
            userResult = new UserResult(sentenceId, user, status);
        }
        log.info("Added new entry for user={} and sentence={} and status={}.", user, sentenceId, status);
        userResultRepository.save(userResult);
    }
}
