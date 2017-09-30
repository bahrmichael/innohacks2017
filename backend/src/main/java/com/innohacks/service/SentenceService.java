package com.innohacks.service;

import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import com.innohacks.domain.Sentence;
import com.innohacks.domain.UserResult;
import com.innohacks.domain.UserResultStatus;
import com.innohacks.repository.SentenceRepository;
import com.innohacks.repository.UserResultRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SentenceService {

    private final Logger log = LoggerFactory.getLogger(SentenceService.class);

    private final SentenceRepository sentenceRepository;
    private final UserResultRepository userResultRepository;

    private Integer totalCount = null;

    @Autowired
    public SentenceService(final SentenceRepository sentenceRepository,
                           final UserResultRepository userResultRepository) {
        this.sentenceRepository = sentenceRepository;
        this.userResultRepository = userResultRepository;
    }

    private int getTotalCount() {
        if (null == totalCount) {
            try {
                totalCount = Math.toIntExact(sentenceRepository.count());
            } catch (ArithmeticException e) {
                log.warn("Exceeded max int.", e);
                totalCount = Integer.MAX_VALUE;
            }
        }
        return totalCount;
    }

    public Sentence getRandomSentence() {
        int random = ThreadLocalRandom.current().nextInt(getTotalCount());
        PageRequest request = new PageRequest(random, 1);
        Page<Sentence> result = sentenceRepository.findAll(request);
        return result.getContent().get(0);
    }

    public String getFlipSide(final String sentence) {
        Optional<Sentence> firstSide = sentenceRepository.findOneByFirstLanguage(sentence);
        if (firstSide.isPresent()) {
            return firstSide.get().getSecondLanguage();
        } else {
            Optional<Sentence> secondSide = sentenceRepository.findOneBySecondLanguage(sentence);
            if (secondSide.isPresent()) {
                return secondSide.get().getFirstLanguage();
            } else {
                log.warn("Could not find flipSide for sentence={}", sentence);
                return "not available";
            }
        }
    }

    public Optional<Sentence> findSentence(final String sentence) {
        Optional<Sentence> firstSide = sentenceRepository.findOneByFirstLanguage(sentence);
        if (firstSide.isPresent()) {
            return firstSide;
        } else {
            return sentenceRepository.findOneBySecondLanguage(sentence);
        }
    }

    public Optional<Sentence> findASentenceWithStatus(final String user, final UserResultStatus status) {
        int random = ThreadLocalRandom.current().nextInt(userResultRepository.countByUserAndStatus(user, status));
        PageRequest request = new PageRequest(random, 1);
        Page<UserResult> all = userResultRepository.findAll(request);
        UserResult userResult = all.getContent().get(0);
        return Optional.of(sentenceRepository.findOne(userResult.getId()));
    }
}
