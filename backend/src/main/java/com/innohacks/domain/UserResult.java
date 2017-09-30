package com.innohacks.domain;

import org.springframework.data.annotation.Id;

public class UserResult {
    @Id
    private String id;
    private String sentenceId;
    private String user;
    private UserResultStatus status;

    public UserResult() {
    }

    public UserResult(final String sentenceId, final String user, final UserResultStatus status) {
        this.sentenceId = sentenceId;
        this.user = user;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(final String id) {
        this.id = id;
    }

    public String getSentenceId() {
        return sentenceId;
    }

    public void setSentenceId(final String sentenceId) {
        this.sentenceId = sentenceId;
    }

    public String getUser() {
        return user;
    }

    public void setUser(final String user) {
        this.user = user;
    }

    public UserResultStatus getStatus() {
        return status;
    }

    public void setStatus(final UserResultStatus status) {
        this.status = status;
    }
}
