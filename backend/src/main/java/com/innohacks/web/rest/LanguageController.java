package com.innohacks.web.rest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.innohacks.domain.Sentence;
import com.innohacks.service.LanguageService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/openapi")
public class LanguageController {

    private static final String EXPLAIN = "explain";
    private static final String SENTENCE = "sentence";
    private static final String SECTION_SENTENCE_REQUIRED = "section_sentence_required";
    private static final String SECTION_EXPLAIN_REQUIRED = "section_explain_required";
    private final LanguageService sentenceService;
    private Map<String, Sentence> recentSentenceOfUser = new HashMap<>();
    private Map<String, List<String>> recentUnknownWords = new HashMap<>();
    private Map<String, LocalDateTime> lastUserInteraction = new HashMap<>();
    private Map<String, String> userSection = new HashMap<>();

    public LanguageController(final LanguageService sentenceService) {
        this.sentenceService = sentenceService;
    }

    @GetMapping("/user/{user}/state/")
    public String getState(@PathVariable("user") String user) {
        LocalDateTime dateTime = lastUserInteraction.get(user);
        lastUserInteraction.put(user, LocalDateTime.now());
        if (null == dateTime) {
            int count = sentenceService.countKnownWords(user);
            if (count > 0) {
                return "new_session";
            } else {
                return "onboarding";
            }
        } else if (isWithin30Minutes(dateTime)) {
            return "continue";
        } else {
            return "new_session";
        }
    }

    private boolean isWithin30Minutes(final LocalDateTime dateTime) {
        return dateTime.isAfter(LocalDateTime.now().minusMinutes(30));
    }

    @GetMapping("/user/{user}/sentence/next/")
    public ResponseEntity getUnknownSentence(@PathVariable("user") String user) {
        lastUserInteraction.put(user, LocalDateTime.now());
        userSection.put(user, SENTENCE);

        Optional<Sentence> optional = sentenceService.getUnknownSentenceForUser(user);
        if (optional.isPresent()) {
            Sentence sentence = optional.get();
            recentSentenceOfUser.put(user, sentence);
            return ResponseEntity.ok(sentence.getGerman());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{user}/sentence/translate/")
    public ResponseEntity getTranslationForRecentSentence(@PathVariable("user") String user) {
        lastUserInteraction.put(user, LocalDateTime.now());
        if (hasNoState(user) || !isSentenceSection(user)) {
            return ResponseEntity.status(411).body(new SectionError(SECTION_SENTENCE_REQUIRED, userSection.get(user)));
        }
        return ResponseEntity.ok(recentSentenceOfUser.get(user).getEnglish());
    }

    private boolean isSentenceSection(final String user) {
        return userSection.get(user).equals(SENTENCE);
    }

    @GetMapping("/user/{user}/explain/")
    public ResponseEntity getUnknownWordsForLastSentence(@PathVariable("user") String user) {
        lastUserInteraction.put(user, LocalDateTime.now());
        if (hasNoState(user) || !isSentenceSection(user)) {
            return ResponseEntity.status(411).body(new SectionError(SECTION_SENTENCE_REQUIRED, userSection.get(user)));
        }

        userSection.put(user, EXPLAIN);

        List<String> unknownWords = sentenceService.getUnknownWords(user, recentSentenceOfUser.get(user));
        recentUnknownWords.put(user, unknownWords);
        return ResponseEntity.ok(unknownWords);
    }

    @PostMapping("/user/{user}/explain/resolve/{yesOrNo}/")
    public ResponseEntity resolveWord(@PathVariable("user") String user, @PathVariable("yesOrNo") String state) {
        lastUserInteraction.put(user, LocalDateTime.now());
        if (hasNoState(user)) {
            return ResponseEntity.status(411).body(new SectionError(SECTION_SENTENCE_REQUIRED, userSection.get(user)));
        } else if (!isExplainState(user)) {
            return ResponseEntity.status(412).body(new SectionError(SECTION_EXPLAIN_REQUIRED, userSection.get(user)));
        }

        List<String> words = recentUnknownWords.get(user);
        String currentWord = words.get(0);
        if ("yes".equalsIgnoreCase(state)) {
            sentenceService.addUserKnownWord(currentWord, user);
        }
        List<String> subList = words.subList(1, words.size());
        recentUnknownWords.put(user, subList);
        if (subList.isEmpty()) {
            userSection.put(user, SENTENCE);
        }
        return ResponseEntity.ok(subList);
    }

    private boolean hasNoState(final String user) {
        return userSection.get(user) == null;
    }

    private boolean isExplainState(final String user) {
        return userSection.get(user).equals(EXPLAIN);
    }

    @GetMapping("/user/{user}/repeat/")
    public ResponseEntity getRepeat(@PathVariable("user") String user) {
        lastUserInteraction.put(user, LocalDateTime.now());

        String state = userSection.get(user);
        // if no state is available, which means the user has not yet requested a first sentence, then we take a random one
        if (null == state) {
            return getUnknownSentence(user);
        }

        if (SENTENCE.equals(state)) {
            return ResponseEntity.ok(recentSentenceOfUser.get(user));
        } else {
            return ResponseEntity.ok(recentUnknownWords.get(user));
        }
    }

    @PostMapping("/sentences/")
    public ResponseEntity postSentences(@RequestBody Sentence sentence) {
        sentenceService.add(sentence);
        return ResponseEntity.ok().build();
    }
}
