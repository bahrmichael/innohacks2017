package com.innohacks.web.rest;

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
        return sentenceService.getRandomSentence().getFirstLanguage();
    }

    @GetMapping("/sentence/{sentence}/translate/")
    public String flipSentence(@PathVariable("sentence") String sentence) {
        return sentenceService.getFlipSide(sentence);
    }

    @PostMapping("/user/{user}/sentence/{sentence}/status/{status}/")
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

    @GetMapping("/user/{user}/status/{status}/")
    public ResponseEntity getResult(@PathVariable("user") String user, @PathVariable("status") UserResultStatus status) {
        Optional<Sentence> optionalSentence = sentenceService.findASentenceWithStatus(user, status);
        if (optionalSentence.isPresent()) {
            return ResponseEntity.ok(optionalSentence.get().getSecondLanguage());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{user}/sentence/")
    public ResponseEntity getResult(@PathVariable("user") String user) {
        // todo miro
        return ResponseEntity.ok().build();
    }
}
