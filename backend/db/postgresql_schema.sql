CREATE SCHEMA alexa;

CREATE TABLE alexa.lang (
    lang_id SERIAL PRIMARY KEY,
    iso_code VARCHAR(3)
);

CREATE TABLE alexa.lang_name (
    lang_src_id INTEGER REFERENCES alexa.lang(lang_id),
    lang_dst_id INTEGER REFERENCES alexa.lang(lang_id),
    content TEXT NOT NULL
);

CREATE TABLE alexa.word (
    word_id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    lang_dst_id INTEGER REFERENCES alexa.lang(lang_id),
    frequency BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE alexa.sentence (
    sentence_id BIGSERIAL PRIMARY KEY,
    lang_src_id INTEGER REFERENCES alexa.lang(lang_id),
    content_src TEXT NOT NULL,
    lang_dst_id INTEGER REFERENCES alexa.lang(lang_id),
    content_dst TEXT NOT NULL
);

CREATE TABLE alexa.word_sentence (
    sentence_id BIGINT REFERENCES alexa.sentence(sentence_id),
    word_id BIGINT REFERENCES alexa.word(word_id)
);

CREATE TABLE alexa.account (
    account_id BIGSERIAL PRIMARY KEY,
    alexa_id TEXT NOT NULL,
    lang_src_id INTEGER REFERENCES alexa.lang(lang_id)
);

CREATE TABLE alexa.learner (
    learner_id BIGSERIAL PRIMARY KEY,
    account_id BIGINT REFERENCES alexa.account(account_id),
    lang_dst_id INTEGER REFERENCES alexa.lang(lang_id)
);

CREATE TABLE alexa.known_words (
    learner_id BIGINT REFERENCES alexa.learner(learner_id),
    word_id BIGINT REFERENCES alexa.word(word_id),
    last_seen_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

