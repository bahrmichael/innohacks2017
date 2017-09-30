var handleError = function(error) {
    var speechOutput = 'no error case matched';
    var err = error.response.data;
    if (err.currentSection === 'init' && err.requiredSection === 'sentence') {
        speechOutput = 'You can start your workout by saying start';
    }
    if (err.currentSection === 'explain' && err.requiredSection === 'sentence') {
        speechOutput = 'Is this a new word? Please choose yes or no.';
    }
    if (err.currentSection !== 'explain' && err.requiredSection === 'explain'){
        speechOutput = notAllowed + 'Valid options are: explain, repeat, next';
    }
    self.emit(":ask", speechOutput, speechOutput);
    // return speechOutput;
};

var AWS = require("aws-sdk");
var toSpeech = function(text) {
    var presigner = new AWS.Polly.Presigner();
    var url = presigner.getSynthesizeSpeechUrl({
        TextType: 'text',
        OutputFormat: 'mp3',
        VoiceId: 'Vickie',
        Text: outputText
    });
    return '<speak><audio src="' + url + '" /></speak>'
};

var notAllowed = 'This option is not allowed.';

var speechOutput;
var reprompt;
var welcomeOutput = "Let's practice your german! giggles";
var welcomeReprompt = "sample re-prompt text";
// 2. Skill Code =======================================================================================================
"use strict";
var Alexa = require('alexa-sdk');
var axios = require('axios');
var understandApi = axios.create({
    baseURL: 'http://46.101.227.37:10000/openapi/',
    timeout: 1000
});
var user = 'Subject';

var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var speechOutput = '';
var handlers = {
    'LaunchRequest': function () {
        welcomeOutput = toSpeech(welcomeOutput);
        this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = '';
        reprompt = '';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        speechOutput = '';
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        speechOutput = '';
        //this.emit(':saveState', true);//uncomment to save attributes to db on session end
        this.emit(':tell', speechOutput);
    },
    "explain": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience

        speechOutput = "This is the explain intent";
        this.emit(":ask", speechOutput, speechOutput);

        var self = this;
        understandApi.get('user/{user}/explain/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);
            }).catch(handleError.bind(self));
    },
    "repeat": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience
        var repeatSlotSlotRaw  = this.event.request.intent.slots.repeatSlot.value;
        console.log(repeatSlotSlotRaw);
        var mainSlotSlot = resolveCanonical(this.event.request.intent.slots.repeatSlot);
        console.log(mainSlotSlot);


        speechOutput = "This is the repeat intent";
        this.emit(":ask", speechOutput, speechOutput);

        var self = this;
        understandApi.get('user/'+ user +'/repeat/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);
            }).catch(handleError.bind(self));

    },
    "next": function () {
        var speechOutput = "";

        var self = this;
        understandApi.get('user/'+ user +'/sentence/next/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);
            }).catch(handleError.bind(self));
    },
    "start": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience
        var mainSlotRaw = this.event.request.intent.slots.main.value;
        console.log(mainSlotRaw);
        var mainSlot = resolveCanonical(this.event.request.intent.slots.main);
        console.log(mainSlot);

        var self = this;
        understandApi.get('user/'+ user +'/sentence/next/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);
            }).catch(handleError.bind(self));
    },
    "understand": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience
        var mainSlotRaw = this.event.request.intent.slots.main.value;
        console.log(mainSlotRaw);
        var mainSlot = resolveCanonical(this.event.request.intent.slots.main);
        console.log(mainSlot);

        var self = this;
        understandApi.get('dummy/mit einer Bratpfanne./')
            .then(function(res) {
                self.emit(":ask", res.data, res.data);
                return res.data;
            });

    },
    "translate": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience
        var transSlotRaw = this.event.request.intent.slots.trans.value;
        console.log(transSlotRaw);
        var transSlot = resolveCanonical(this.event.request.intent.slots.trans);
        console.log(transSlot);

        var self = this;
        understandApi.get('user/'+ user +'/sentence/translate/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);
            }).catch(handleError.bind(self));
    },
    "yes": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience

        // speechOutput = "This is a place holder response for the intent named yes.";
        // this.emit(":ask", speechOutput, speechOutput);
        var self = this;
        understandApi.post('user/'+ user +'/explain/resolve/yes/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);

                if (res.data && res.data.length === []){
                    speechOutput = "No more new words";
                    self.emit(":ask", speechOutput, speechOutput);

                    understandApi.get('user/'+ user +'/sentence/repeat/')
                        .then(function(res) {
                            speechOutput = res.data;
                            self.emit(":ask", speechOutput, speechOutput);
                        }).catch(handleError.bind(self));
                }
            }).catch(handleError.bind(self));
    },
    "no": function () {
        var speechOutput = "";
        //any intent slot variables are listed here for convenience

        var self = this;
        understandApi.post('user/'+ user +'/explain/resolve/no/')
            .then(function(res) {
                speechOutput = res.data;
                self.emit(":ask", speechOutput, speechOutput);

                if (res.data && res.data.length === []){
                    speechOutput = "No more new words";
                    self.emit(":ask", speechOutput, speechOutput);

                    understandApi.get('user/'+ user +'/sentence/repeat/')
                        .then(function(res) {
                            speechOutput = res.data;
                            self.emit(":ask", speechOutput, speechOutput);
                        }).catch(handleError.bind(self));
                }
            }).catch(handleError.bind(self));
    },
    'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted.  Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    //alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME'; //uncomment this line to save attributes to DB
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
