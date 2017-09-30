# _stand Backend
This is the backend of understand. The skeleton was generated with JHipster, so there are a couple boilerplate classes. The interesting classes are
* LanguageController
* LanguageService

and their used repositories/entities.

The provided application will serve lambda requests on /openapi/**. The application's setup allows for administration and easy addition of frontends.

## State Model

TBD

TBD: Consider the sentence/explain states introduced during /repeat/ reduction.

## APIs

The API always requires a user to operate on.

The URI has the two sections `sentence` and `explain` as explained in the state model (TBD).

A word is considered unknown, if the user has not marked it as known through `/openapi/user/{user}/explain/resolve/{state}/`

The application provides the following APIs:

### /openapi/user/{user}/state/

#### GET

Returns the current state of the user. Can be either `onboarding`, `new_session` or `continue`. These states are used by lambda to determine the greeting text upon skill startup.

### /openapi/user/{user}/repeat/

#### GET

Returns the latest sentence or list of unknown words depending on the `userContext` which can either be `sentence` or `explain`.

The list of unknown words may be reduced by /resolve/{state}/.

The context switch is done to reduce the number of intent and "just repeat the last thing" Alexa said.

### /openapi/user/{user}/sentence/

This is the sentence context. When starting the app, the first call must be to `/random/` to pick a first sentence to learn on.

#### GET /random/

Returns a German sentence of which the user doesn't know one or more words.

Sets the `userContext` to `sentence`.

#### GET /next/

See /random/.

#### GET /translate/

Returns the translation of the last sentence that was returned by /random/, which must have been called first.

### /openapi/user/{user}/explain/

This is the explain context. It provides more details on the previously selected sentence. You must have called any of the `sentence` URIs in advance.

#### GET

Returns all unknown words of the recent sentence.

Sets the `userContext` to `explain`.

#### POST /resolve/{yesOrNo}/

If `yesOrNo` is `yes`, then the currently first unknown word is added to the user's known words.
If `yesOrNo` is `no`, then the currently first unknown word is not added to the user's known words.

The API then removes the first element of the currently unknown words and returns the reduced list.

Sets the `userContext` to `sentence` if there are no more remaining words in the reduced list.
