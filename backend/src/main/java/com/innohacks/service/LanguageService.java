package com.innohacks.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import com.innohacks.domain.Sentence;
import com.innohacks.domain.UserKnownWord;
import com.innohacks.repository.SentenceRepository;
import com.innohacks.repository.UserKnownWordsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class LanguageService {

    private final Logger log = LoggerFactory.getLogger(LanguageService.class);

    private final SentenceRepository sentenceRepository;
    private final UserKnownWordsRepository userKnownWordsRepository;

    private Integer totalCount = null;

    @Autowired
    public LanguageService(final SentenceRepository sentenceRepository,
                           final UserKnownWordsRepository userKnownWordsRepository) {
        this.sentenceRepository = sentenceRepository;
        this.userKnownWordsRepository = userKnownWordsRepository;
    }

    private int getTotalCount() {
        if (null == totalCount) {
            totalCount = 1000;
//            totalCount = (int) sentenceRepository.count();
        }
        return totalCount;
    }

    public Sentence getRandomSentence() {
        int random = ThreadLocalRandom.current().nextInt(getTotalCount());
        PageRequest request = new PageRequest(random, 1);
        Page<Sentence> result = sentenceRepository.findAll(request);
        return result.getContent().get(0);
    }

    public String getTranslation(final String sentence) {
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

    public Optional<Sentence> getUnknownSentenceForUser(final String user) {
        List<UserKnownWord> knownWords = userKnownWordsRepository.findByUser(user);

        int count = 0;

        // dirty fix: allow max 10 000 retries before returning an empty result
        int maxTries = 10000;

        Sentence randomSentence = null;
        while (count == 0) {
            randomSentence = getRandomSentence();
            String germanSentence = randomSentence.getGerman();

            count = countUnknownWords(germanSentence, knownWords);

            if (0 <= maxTries--) {
                return Optional.empty();
            }
        }

        return Optional.of(randomSentence);
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

    public void addUserKnownWord(final String currentWord, final String user) {
        UserKnownWord word = new UserKnownWord();
        word.setUser(user);
        word.setWord(currentWord.toLowerCase());
        userKnownWordsRepository.save(word);
    }

    public int countKnownWords(final String user) {
        return userKnownWordsRepository.countByUser(user);
    }
}
