var uuidv5 = require('uuid/v5');
var AWS = require("aws-sdk");
var S3 = new AWS.S3();

module.exports = {
    hashSentence: function(sentence) {
        const MY_NAMESPACE = uuidv5('<lexiQ_Sentence_ID>', uuidv5.DNS);
        return uuidv5(/*'Ich bin ein hans'*/sentence, MY_NAMESPACE);
    },
    // Todo: hash the src senctence and save as hash.mp3 on the bucket.
    // Then prepend fetching sentence by hash if the file exists on the S3 bucket
    toLocaleSpeech: function(text, locale, wrapperSentence, userId, context) {
        var polly = new AWS.Polly();
        var voiceId = 'Vicki';

        switch (locale){
            case 'de': voiceId = 'Hans'; break;
            case 'fr': voiceId = 'Mathieu'; break;
            case 'it': voiceId = 'Giorgio'; break;
            case 'en': voiceId = 'Justin'; break;
            case 'es': voiceId = 'Enrique'; break;
            case 'pl': voiceId = 'Jacek'; break;
            default: voiceId = 'Justin'; break;
        }
        // https://s3.console.aws.amazon.com/s3/buckets/innohacks2017/?region=eu-west-1&tab=overview
        // https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/lexiQ_Response?tab=graph


        try{
            var hashedName = this.hashSentence(text);
            if (true){
                var params = {
                    Bucket: "innohacks2017",
                    Key: hashedName + ".mp3"
                };
                S3.headObject(params, function (err, metadata) {
                    if (err && err.code === 'NotFound') {
                        console.log('hashed file doesn\'t exist yet', ' - text: '+ text + ' hash :: ' + hashedName, err, err.stack);
                        // hashed file does NOT yet exist, so generate the file
                        polly.synthesizeSpeech({
                            TextType: 'text',
                            OutputFormat: 'mp3',
                            VoiceId: voiceId,
                            Text: text
                        }, function(err, data) {
                            if (err) {
                                console.log("ERRRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", err, err.stack);
                                throw err; // an error occurred
                            } else {
                                if (data.AudioStream instanceof Buffer) {
                                    var params = {
                                        Body: data.AudioStream,
                                        Bucket: "innohacks2017",
                                        Key: hashedName + ".mp3",
                                        ACL: "public-read"
                                    };

                                    S3.putObject(params, function(err, data) {
                                        if (err) {
                                            var speechOutput = "Upsalla, something went wrong during the translation.";
                                            console.log(err, err.stack);
                                            context.emit(':ask', speechOutput, speechOutput);
                                        } // an error occurred
                                        else {
                                            // console.log('synthesized new file ', data);

                                            var url = 'https://s3-eu-west-1.amazonaws.com/innohacks2017/' + hashedName + '.mp3';
                                            var ssml = '<audio src="' + url + '" />';
                                            context.emit(':ask', wrapperSentence.replace('$$', ssml), 'reprompt');
                                        }           // successful response
                                    });
                                }
                                return 'The translation process failed';
                            }
                        });
                    } else {
                        console.log('headObject, file seems to exist, so dont synthesize ', ' - text: '+ text + ' hash :: ' + hashedName);
                        var url = 'https://s3-eu-west-1.amazonaws.com/innohacks2017/' + hashedName + '.mp3';
                        var ssml = '<audio src="' + url + '" />';
                        context.emit(':ask', wrapperSentence.replace('$$', ssml), 'reprompt');
                    }
                });
            }
        }catch(e){
            context.emit(':ask', wrapperSentence.replace('$$', 'no translation possible'), 'reprompt');
        }
    }
};