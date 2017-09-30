# _stand Backend
This is the backend of understand. The skeleton was generated with JHipster, so there are a couple boilerplate classes. The interesting classes are
* LanguageController
* LanguageService

and their used repositories/entities.

The provided application will serve lambda requests on /openapi/**. The application's setup allows for administration and easy addition of frontends.

## State Model

TBD

## APIs

The API always requires a user to operate on.

The URI has the two sections `sentence` and `explain` as explained in the state model (TBD).

A word is considered unknown, if the user has not marked it as known through `/openapi/user/{user}/explain/resolve/{state}/`

The application provides the following APIs:

### /openapi/user/{user}/sentence/

This is the sentence context. When starting the app, the first call must be to `/random/` to pick a first sentence to learn on.

#### GET /random/

Returns a German sentence of which the user doesn't know one or more words.

#### GET /next/

See /random/.

#### GET /repeat/

Returns the last sentence that was returned by /random/, which must have been called first.

#### GET /translate/

Returns the translation of the last sentence that was returned by /random/, which must have been called first.

### /openapi/user/{user}/explain/

This is the explain context. It provides more details on the previously selected sentence. You must have called any of the `sentence` URIs in advance.

#### GET /

Returns all unknown words of the recent sentence.

#### GET /repeat/

Returns the unknown words of the recent sentence. The list may be reduced by /resolve/{state}/.

#### GET /resolve/{state}/

If state=yes, then the currently first unknown word is added to the user's known words.
If state=no, then the currently first unknown word is not added to the user's known words.

The API then removes the first element of the currently unknown words and returns the reduced list.
