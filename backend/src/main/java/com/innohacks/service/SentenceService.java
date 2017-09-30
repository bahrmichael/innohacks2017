package com.innohacks.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import com.innohacks.domain.Sentence;
import com.innohacks.domain.UserKnownWord;
import com.innohacks.domain.UserResult;
import com.innohacks.domain.UserResultStatus;
import com.innohacks.repository.SentenceRepository;
import com.innohacks.repository.UserKnownWordsRepository;
import com.innohacks.repository.UserResultRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class SentenceService {

    private final Logger log = LoggerFactory.getLogger(SentenceService.class);

    private final SentenceRepository sentenceRepository;
    private final UserResultRepository userResultRepository;
    private final UserKnownWordsRepository userKnownWordsRepository;

    private Integer totalCount = null;

    @Autowired
    public SentenceService(final SentenceRepository sentenceRepository,
                           final UserResultRepository userResultRepository,
                           final UserKnownWordsRepository userKnownWordsRepository) {
        this.sentenceRepository = sentenceRepository;
        this.userResultRepository = userResultRepository;
        this.userKnownWordsRepository = userKnownWordsRepository;
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
            return firstSide.get().getGerman();
        } else {
            Optional<Sentence> secondSide = sentenceRepository.findOneBySecondLanguage(sentence);
            if (secondSide.isPresent()) {
                return secondSide.get().getEnglish();
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

    public Sentence getUnknownSentenceForUser(final String user) {
        List<UserKnownWord> knownWords = userKnownWordsRepository.findByUser(user);

        int count = 0;

        Sentence randomSentence = null;
        while (count == 0) {
            // todo mba: fix possible endless loop
            randomSentence = getRandomSentence();
            String germanSentence = randomSentence.getGerman();

            count = countUnknownWords(germanSentence, knownWords);
        }

        return randomSentence;
    }

    private int countUnknownWords(final String sentence, final List<UserKnownWord> knownWords) {
        return getUnknownWords(sentence, knownWords).size();
    }

    public List<String> getUnknownWords(final String user, final Sentence sentence) {
        return getUnknownWords(sentence.getGerman(), userKnownWordsRepository.findByUser(user));
    }

    private List<String> getUnknownWords(final String sentence, final List<UserKnownWord> knownWords) {
        List<String> words = new ArrayList<>();

        String[] sentenceWords = sentence.split("\\W+");
        for (String sentenceWord : sentenceWords) {
            if ("".equals(sentenceWord)) {
                continue;
            }

            for (UserKnownWord knownWord : knownWords) {
                if (!sentenceWord.equalsIgnoreCase(knownWord.getWord())) {
                    words.add(sentenceWord);
                }
            }
        }

        return words;
    }
}
