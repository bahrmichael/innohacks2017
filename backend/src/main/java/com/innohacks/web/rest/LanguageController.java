package com.innohacks.web.rest;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/openapi")
public class LanguageController {

    private final LanguageService sentenceService;
    private Map<String, Sentence> recentSentenceOfUser = new HashMap<>();
    private Map<String, List<String>> recentUnknownWords = new HashMap<>();

    public LanguageController(final LanguageService sentenceService) {
        this.sentenceService = sentenceService;
    }

    @GetMapping("/dummy/")
    public String dummy() {
        return "Hallo Welt!";
    }

    @GetMapping("/dummy/{sentence}/")
    public String dummyLong(@PathVariable("sentence") String sentence) {
        return sentence;
    }

    @GetMapping("/sentence/random/")
    public String getRandomSentence() {
        return sentenceService.getRandomSentence().getEnglish();
    }

    @GetMapping("/sentence/{sentence}/translate/")
    public String flipSentence(@PathVariable("sentence") String sentence) {
        return sentenceService.getTranslation(sentence);
    }

    @GetMapping("/user/{user}/sentence/random/")
    public ResponseEntity getUnknownSentence(@PathVariable("user") String user) {
        Optional<Sentence> optional = sentenceService.getUnknownSentenceForUser(user);
        if (optional.isPresent()) {
            Sentence sentence = optional.get();
            recentSentenceOfUser.put(user, sentence);
            return ResponseEntity.ok(sentence.getGerman());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{user}/sentence/next/")
    public ResponseEntity getResult(@PathVariable("user") String user) {
        return getUnknownSentence(user);
    }

    @GetMapping("/user/{user}/sentence/repeat/")
    public ResponseEntity getRepeat(@PathVariable("user") String user) {
        return ResponseEntity.ok(recentSentenceOfUser.get(user));
    }

    @GetMapping("/user/{user}/sentence/translate/")
    public ResponseEntity getTranslationForRecentSentence(@PathVariable("user") String user) {
        return ResponseEntity.ok(recentSentenceOfUser.get(user).getEnglish());
    }

    @GetMapping("/user/{user}/explain/")
    public ResponseEntity getUnknownWordsForLastSentence(@PathVariable("user") String user) {
        List<String> unknownWords = sentenceService.getUnknownWords(user, recentSentenceOfUser.get(user));
        recentUnknownWords.put(user, unknownWords);
        return ResponseEntity.ok(unknownWords);
    }

    @GetMapping("/user/{user}/explain/repeat/")
    public ResponseEntity repeatLatestWord(@PathVariable("user") String user) {
        return getUnknownWordsForLastSentence(user);
    }

    @PostMapping("/user/{user}/explain/resolve/{state}/")
    public ResponseEntity resolveWord(@PathVariable("user") String user, @PathVariable("state") String state) {
        List<String> words = recentUnknownWords.get(user);
        String currentWord = words.get(0);
        if ("yes".equalsIgnoreCase(state)) {
            sentenceService.addUserKnownWord(currentWord, user);
        }
        List<String> subList = words.subList(1, words.size());
        recentUnknownWords.put(user, subList);
        return ResponseEntity.ok(subList);
    }
}
