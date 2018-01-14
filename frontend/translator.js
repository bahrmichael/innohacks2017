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

        // switch (locale){
        //     case 'de_de': voiceId = 'Hans'; break;
        //     case 'fr_fr': voiceId = 'Mathieu'; break;
        //     case 'it_it': voiceId = 'Giorgio'; break;
        //     case 'en_us': voiceId = 'Justin'; break;
        //     case 'es_es': voiceId = 'Enrique'; break;
        //     case 'pl_pl': voiceId = 'Jacek'; break;
        //     case default: voiceId = 'Justin'; break;
        // }
        //S3.getObject( + '.mp3')

        if (true){
            console.log('hash :: ' + this.hashSentence('text'));
        }

        try{
            polly.synthesizeSpeech({
                TextType: 'text',
                OutputFormat: 'mp3',
                VoiceId: voiceId,
                Text: text
            }, function(err, data) {
                if (err) {
                    console.log("ERRRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
                    console.log(err, err.stack);
                    throw err; // an error occurred
                } else {
                    if (data.AudioStream instanceof Buffer) {
                        var params = {
                            Body: data.AudioStream,
                            Bucket: "innohacks2017",
                            Key: "audio.mp3",
                            ACL: "public-read"
                        };
                        console.log('within synthesizeSpeech' + data.AudioStream, Buffer);
                        S3.putObject(params, function(err, data) {
                            console.log('within S3.putObject');
                            if (err) {
                                var speechOutput = "Upsalla, something went wrong during the translation.";
                                console.log(err, err.stack);
                                context.emit(':ask', speechOutput, speechOutput);
                            } // an error occurred
                            else {
                                console.log(data);

                                var url = 'https://s3-eu-west-1.amazonaws.com/innohacks2017/audio.mp3';
                                var ssml = '<audio src="' + url + '" />';
                                context.emit(':ask', wrapperSentence.replace('$$', ssml), 'reprompt');
                            }           // successful response
                        });
                    }
                    return 'The translation process failed';
                }
            });
        }catch(e){
            context.emit(':ask', wrapperSentence.replace('$$', 'no translation possible'), 'reprompt');
        }
    }
};