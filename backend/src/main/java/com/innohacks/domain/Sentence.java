package com.innohacks.domain;

import org.springframework.data.annotation.Id;

public class Sentence {
    @Id
    private String id;
    private String firstLanguage;
    private String secondLanguage;

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public String getFirstLanguage() {
        return firstLanguage;
    }

    public void setFirstLanguage(final String firstLanguage) {
        this.firstLanguage = firstLanguage;
    }

    public String getSecondLanguage() {
        return secondLanguage;
    }

    public void setSecondLanguage(final String secondLanguage) {
        this.secondLanguage = secondLanguage;
    }
}
