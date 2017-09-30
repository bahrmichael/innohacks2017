package com.innohacks.web.rest;

import com.innohacks.service.SentenceService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/openapi")
public class MainController {

    private final SentenceService sentenceService;

    public MainController(final SentenceService sentenceService) {
        this.sentenceService = sentenceService;
    }

    @GetMapping("/dummy")

    public String dummy() {
        return "Hallo Welt!";
    }

    @GetMapping("/dummy/{sentence}")
    public String dummyLong(
            @PathVariable("sentence")
                    String sentence) {
        return sentence;
    }

    @GetMapping("/sentence/random")
    public String getRandomSentence() {
        return sentenceService.getRandomSentence().getFirstLanguage();
    }

    @GetMapping("/sentence/{sentence}/flip")
    public String flipSentence(@PathVariable("sentence") String sentence) {
        // todo: we might need to url decode the sentence
        return sentenceService.getFlipSide(sentence);
    }

}
