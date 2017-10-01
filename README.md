# Build the vocabulary in a foreign language you understand

This Alexa skill exposes you to random sentences in a foreign language that
are just a tiny step behind your current level. It keeps track of the
vocabulary you already know and helps you to progress.

<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/lingling.svg?sanitize=true">
</h3>

## Table of contents
1. [How learning a language works](#language)
2. [How the skill works](#skill)
3. [Where the data comes from](#data)

## How learning a language works<a name="language"></a>

The four pillars of language learning: reading, listening, writing and
speaking all depend on acquisition of a decent quantity of vocabulary. This
can be done only by an extensive exposure to chunks of destination language,
such as whole sentences.

Already after an introduction to a language done by other means, we can build
on the knowledge of a few dozens words and show the learner some sentences
that contain mostly known words together with one or two new words. Comparing
these sentences to their English translation (done by humans), the learner
will understand the meaning of those few new words.

After certain time and repeated exposure, the learner will recognize the words
and can mark them as familiar, which will immediately open doors to even more
and more sentences.

## How the skill works<a name="skill"></a>

The user chooses a language to practice. If this is a new language, an
approximate evaluation of his vocabulary size will be done by a bisection of
a frequency list where the user indicates whether he understands the word in
the destination language or not.

The main loop of the skill will then search for random sentences from the
database that contain a certain number of new words and read them to the user.
It is then possible to _repeat_, _translate_ or skip to the _next_ sentence.
If the whole sentence is _easy_ to the user, all unknown words will be marked
as known.

If the user wants Alexa to _explain_ the sentence, it will read him all the
unknown words one after one together with a translation and the user can
confirm whether the word is familiar to him or not.

In the following diagram, Alexa speaks blue, the user speaks yellow and the
backend processes are in black&white fields:

<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/diagram.dot.svg?sanitize=true">
</h3>

## Where the data comes from<a name="data"></a>

Sentences pairs come from [tatoeba.org](https://tatoeba.org/eng/downloads)
(released under CC-BY).

Frequency lists come from
[Wiktionary:Frequency\_lists](https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists).
