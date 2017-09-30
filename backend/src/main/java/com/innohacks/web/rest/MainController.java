package com.innohacks.web.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.innohacks.domain.Sentence;
import com.innohacks.domain.UserResultStatus;
import com.innohacks.service.SentenceService;
import com.innohacks.service.UserResultService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/openapi")
public class MainController {

    private final SentenceService sentenceService;
    private final UserResultService userResultService;
    private Map<String, Sentence> recentSentenceOfUser = new HashMap<>();
    private Map<String, List<String>> recentUnknownWords = new HashMap<>();
    private Map<String, Integer> recentUnknownWordCount = new HashMap<>();

    public MainController(final SentenceService sentenceService,
                          final UserResultService userResultService) {
        this.sentenceService = sentenceService;
        this.userResultService = userResultService;
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
        return sentenceService.getFlipSide(sentence);
    }

//    @PostMapping("/user/{user}/sentence/{sentence}/status/{status}/")
    public ResponseEntity postResult(@PathVariable("user") String user, @PathVariable("sentence") String sentence, @PathVariable("status")
            UserResultStatus status) {
        Optional<Sentence> optionalSentence = sentenceService.findSentence(sentence);
        if (optionalSentence.isPresent()) {
            String sentenceId = optionalSentence.get().getId();
            userResultService.update(user, sentenceId, status);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("/user/{user}/status/{status}/")
    public ResponseEntity getResult(@PathVariable("user") String user, @PathVariable("status") UserResultStatus status) {
        Optional<Sentence> optionalSentence = sentenceService.findASentenceWithStatus(user, status);
        if (optionalSentence.isPresent()) {
            return ResponseEntity.ok(optionalSentence.get().getGerman());
        } else {
            return ResponseEntity.notFound().build();
        }
    }





    @GetMapping("/user/{user}/sentence/random/")
    public ResponseEntity getUnknownSentence(@PathVariable("user") String user) {
        Sentence sentence = sentenceService.getUnknownSentenceForUser(user);
        recentSentenceOfUser.put(user, sentence);
        return ResponseEntity.ok(sentence.getGerman());
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
        recentUnknownWordCount.put(user, 0);
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







//    @GetMapping("/user/{user}/last-sentence/explain/current-word/")
    public ResponseEntity explainCurrentWord(@PathVariable("user") String user) {
        Integer index = recentUnknownWordCount.get(user);
        recentUnknownWordCount.put(user, index + 1);
        List<String> unknownWords = recentUnknownWords.get(user);
        if (unknownWords.size() < index + 1) {
            return ResponseEntity.notFound().build();
        } else {
            String word = unknownWords.get(index);
            return ResponseEntity.ok(word);
        }
    }
}
