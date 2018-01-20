/**
 * Created by Eternal on 20.01.2018.
 */
var translation = null;
var i18n = {
    'en': require('./en'),
    'de': require('./de')
};

module.exports = {
    setLanguage: function(locale){
        if (locale && locale.length >= 2) { translation = i18n[locale]; return;}
        throw Error;
    },
    getTranslation: function(identifier) {
        var indexes = identifier.split('.');
        indexes = (indexes && indexes.constructor === Array && indexes.length) ? indexes: [];
        var t = translation;
        indexes.forEach(function(id) {
            console.log('t: ', t);
            t = t[id];
        });
        if(t === undefined || t === null) { console.warn(identifier + 'can not be translated'); }
        return t;
    }
};