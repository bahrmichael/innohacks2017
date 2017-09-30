package com.innohacks.web.rest;

public class SectionError {
    private String requiredSection;
    private String currentSection;

    public SectionError(final String requiredSection, final String currentSection) {
        this.requiredSection = requiredSection;
        this.currentSection = currentSection;
    }

    public SectionError() {
    }

    public String getRequiredSection() {
        return requiredSection;
    }

    public String getCurrentSection() {
        return currentSection;
    }

    public void setRequiredSection(final String requiredSection) {
        this.requiredSection = requiredSection;
    }

    public void setCurrentSection(final String currentSection) {
        this.currentSection = currentSection;
    }
}
