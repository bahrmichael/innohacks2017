/* This code has been generated from your interaction model

/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/*

 /init -> 201 || 204 -> languages

 Languages intent mit Language names
 /language -> result enthält verfügbare language-Names, falls selectedTargetLanguage in language names, set language over /learner/{languageName}
 /onboarding-completed -> solange 204, get /onboarding-completed, else get /sentence

 */
var notAllowed = 'This option is not allowed.';

var handleError = function(error) {
    var err = error.response.data;
    var speechOutput = 'no error case matched';
    if (err.currentSection === 'init' && err.requiredSection === 'sentence') {
        speechOutput = 'You can start your workout by saying start';
    }
    if (err.currentSection !== 'explain' && err.requiredSection === 'explain'){
        speechOutput = notAllowed + 'Valid options are: explain, repeat, next';
    }
    this.emit(":ask", speechOutput, speechOutput);
};
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var deviceLocale = ''

var userId = '';
var selectedLanguage = '';
var utterance = '';

var AWS = require("aws-sdk");
var T = require("./translator");
var axios = require("axios");

var getApi = function() {
    var api = axios.create({
        baseURL: 'http://52.213.36.32:8080/',
        timeout: 3000,
        headers: {
            'X-ALEXA-ID': userId,
            'X-ALEXA-LANGUAGE': selectedLanguage,
            'X-UTTERANCE': utterance
        }
    })
    return api;
}

var continueSentence = " . I will continue";
var startSpeechOutput = 'You can start the session by saying start or ok.';
var helpSpeechOutput =
    'You can get a translation of the last sentence by saying translate. ' +
    'You can make me repeat the last sentence by saying repeat or again. ' +
    'Other then that you can proceed with the next sentence by saying ok or yes, if you understood' +
    ' the sentence. Say no if you did not understand the sentence.'
var understandQuestion = '... , Did you understand this sentence?';



var speechOutput;
var reprompt;
var welcomeOutput = startSpeechOutput;
var welcomeReprompt = startSpeechOutput;
 // 2. Skill Code =======================================================================================================
"use strict";
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var speechOutput = '';
var handlers = {
    'AMAZON.HelpIntent': function () {
        speechOutput = helpSpeechOutput;
        reprompt = '';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = 'Really? bye bye kiddo!';
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        speechOutput = 'The session ended.';
        //this.emit(':saveState',�true);//uncomment to save attributes to db on session end
        this.emit(':tell', speechOutput);
    },
    'LaunchRequest': function () {
        var self = this;
        // utterance = 'blub';
        // console.log('this.event.request: ', this.event.request);

        var api = getApi();
        api.post('init/')
            .then(function(res) {
                speechOutput = "Fantastic, let's go! $$" + understandQuestion;
                console.log('res.status: ', res);
                if (res.status === 204 || res.status === 201){ //exists or created
                    api.get('languages/')
                        .then(function(res) {
                            console.log('res.status: ', res, JSON.stringify(res.data));
                            var selectableLanguages = (res.data && res.data.constructor === Array && res.data.length === 1)
                                ? res.data.join(', and ') : 'there are no languages to select';
                            var choseBetween = (res.data.length > 1) ? 'between' : '';
                            speechOutput = "Which language do you want to learn: You can chose " + choseBetween + ": " + selectableLanguages;
                            self.emit(":ask", speechOutput, speechOutput);
                        }).catch(function(err) {
                            if (res.status === 204 || res.status === 201){ //exists or created

                            }
                            throw err;
                        });
                }else{
                    self.emit(":ask", speechOutput, speechOutput);
                }
            }).catch(function(err) {
                console.log('err: ', err);
                speechOutput = "I'm having a headache and didn't get your last answer. " + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
        // this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
	"works": function () {
        var self = this;
		var speechOutput = "";
        utterance = 'I want to work';
        console.log('this.event.request: ', this.event.request);

        var api = getApi();
        api.get('sentence')
            .then(function(res) {
                console.log('res: ', res);
                speechOutput = "Fantastic, let's go! $$" + understandQuestion;
                try{
                    T.toLocaleSpeech(
                        res,
                        'de_de',
                        speechOutput,
                        userId,
                        self
                    );
                }catch(e){
                    self.emit(":ask", speechOutput, speechOutput);
                }
            }).catch(function(res) {
                speechOutput = "I'm having a headache and didn't get your last answer. " + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
    },
	"chooseLanguage": function () {
        var self = this;
		var speechOutput = "";
        console.log('this.event.request.intent.slots: ', this.event.request.intent.slots);
        var chooseLanguageSLOT = this.event.request.intent.slots.language.value;
        utterance = this.event.request.intent.slots.language.value;

        var api = getApi();
        api.get('languages/')
            .then(function(res) {
                console.log('res.status: ', res, JSON.stringify(res.data));
                /* if the entered language is part of the possible languages delivered
                *  by the /language service, set learners language to the entered language */
                res.data && res.data.constructor === Array && res.data.some(function(lang) {
                    console.log('lang, chooseLanguageSLOTRaw === lang', lang, chooseLanguageSLOT === lang)
                    return chooseLanguageSLOT === lang;
                }) && api.put('learner/' + encodeURIComponent(chooseLanguageSLOT))
                    .then(function(res) {
                        console.log('res: ', res);
                        speechOutput = "Noted that, your selected language is: " + chooseLanguageSLOT + ". Let's start with the onboarding process";
                        self.emit(":ask", speechOutput, speechOutput);
                    }).catch(function(err) {
                        throw err;
                    });

            }).catch(function(err) {
                speechOutput = "I'm having a headache and didn't get your last answer. " + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
    },
	"yes": function () {
        var self = this;
		var speechOutput = "";
        var yesSLOTRaw  = this.event.request.intent.slots.yesSLOT.value;
        utterance = yesSLOTRaw;
		var gratulation = ['wonderful', 'nice', 'fantastic', 'awesome', 'well', 'cool', 'perfect'];
    	//any intent slot variables are listed here for convenience

        //normal case: continueSentence == '.I will continue'
        if (random(0, 10) <= 3) {
            continueSentence = "let\'s continue";
            understandQuestion = '';
        }
    	//Your custom intent handling goes here
        var api = getApi();
        api.post('sentence/ok')
            .then(function(res) {
                speechOutput = gratulation[(random(0,7))] + ", " + continueSentence + ". $$" + understandQuestion;
                T.toLocaleSpeech(
                    res,
                    'de_de',
                    speechOutput,
                    userId,
                    self
                );
            }).catch(function(res) {
                speechOutput = "I'm having a headache and didn't get your last answer. " + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
    },
	"no": function () {
        var self = this;
		var speechOutput = "";
        var noSLOTRaw  = this.event.request.intent.slots.noSLOT.value;
        utterance = noSLOTRaw;
		var sadlyOutput = "let's continue anyways. ";
    	//any intent slot variables are listed here for convenience

        //normal case: continueSentence == '.I will continue'
        if (random(0, 10) === 5) {
            continueSentence = helpSpeechOutput;
            // understandQuestion = '';
        }else if(random(0, 10) > 6){
            continueSentence = '';
            sadlyOutput = '';
        }

        var api = getApi();
        api.post('sentence/notok')
            .then(function(res) {
                speechOutput = "I noticed that, " + sadlyOutput + ". hmm, ... $$" + understandQuestion;
                T.toLocaleSpeech(
                    res,
                    'de_de',
                    speechOutput,
                    userId,
                    self
                );
            }).catch(function(res) {
                speechOutput = "I'm having a headache. " + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
    },
    "translate": function () {
        var self = this;
        var speechOutput = "";
        var translateSLOTRaw  = this.event.request.intent.slots.translateSLOT.value;
        utterance = translateSLOTRaw;
        var wrapperSentence = "The translation is $." + understandQuestion;

        var api = getApi();
        api.get('sentence/translate')
            .then(function(res) {
                if (random(0,10) < 7){ understandQuestion = ''; }
                speechOutput = "The translation is: " + res + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            }).catch(function(res) {
                T.toLocaleSpeech(
                    /*res*/"Gefangen. Ich bin ein deutschsprechender Hans.",
                    'de_de',
                    "$$",
                    userId,
                    self
                );
                speechOutput = "I'm having a headache and therefore can't think properly. " + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
    },
    "repeat": function () {
        var self = this;
        var speechOutput = "";
        var repeatSLOTRaw  = this.event.request.intent.slots.repeatSLOT.value;
        utterance = repeatSLOTRaw;
        //any intent slot variables are listed here for convenience

        //Your custom intent handling goes here
        var api = getApi();
        api.get('sentence/repeat')
            .then(function(res) {
                speechOutput = "repeat intent then. you said "+ repeatSLOTRaw + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
                T.toLocaleSpeech(
                    res,
                    'de_de',
                    "$$",
                    userId,
                    self
                );
            }).catch(function(res) {
                speechOutput = "I'm sorry, I can't repeat the sentence." + understandQuestion;
                self.emit(":ask", speechOutput, speechOutput);
            });
    },
	'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted. Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};


// userId = context.System.user.userId;
exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    userId = event.session.user.userId;
    selectedLanguage = (event.request.locale) ? event.request.locale.split('-')[0] : 'en';
    deviceLocale = (event.request.locale) ? event.request.locale: 'en-US';
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    //alexa.dynamoDBTableName�=�'DYNAMODB_TABLE_NAME';�//uncomment this line to save attributes to DB
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function resolveCanonical(slot){
	//this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
    try{
		var canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
	}catch(err){
	    console.log(err.message);
	    var canonical = slot.value;
	};
	return canonical;
};

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
	  var updatedIntent= null;
	  // updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      //this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code is necessary if using ASK SDK versions prior to 1.0.9 
	  if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
			shouldEndSession: false
		});
		this.emit(':responseReady', updatedIntent);
		
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      //this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code necessary is using ASK SDK versions prior to 1.0.9
		if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
			shouldEndSession: false
		});
		this.emit(':responseReady');
		
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
    var slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    var alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    var returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}