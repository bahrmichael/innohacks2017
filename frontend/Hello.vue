<template>
  <div class="heading">
    <h1>{{ msg }}</h1>

  </div>
</template>

<script>
  var handleError = function(error) {
    var speechOutput;
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
    return speechOutput;
  };

  import axios from 'axios'
  var understandApi = axios.create({
    baseURL: 'http://46.101.227.37:10000/openapi/',
    timeout: 1000
  });

  export default {
    name: 'hello',
    data () {
      return {
        user: 'subject',
        msg: 'Welcome to Understand'
      }
    },
    mounted: function() {
      var self = this;
      var understandApi = axios.create({
        baseURL: 'http://46.101.227.37:10000/openapi/',
        timeout: 1000
      });
      var speechOutput = '';

      understandApi.get('user/' + this.user + '/state/')
        .then(function(res) {
          speechOutput = res.data;
          console.log('speechOutput: ', speechOutput);
        })
        .catch(function(error) {
          console.log('error: ', error);
        });

//      speechOutput = understandApi.get('user/' + self.user + '/explain/')
//        .then(function(res) {
//          speechOutput = res.data;
//          console.log('error speechOutput: ', speechOutput);
//        })
//        .catch(handleError.bind(self));

      understandApi.get('user/' + self.user + '/sentence/next/')
        .then(function(res) {
          speechOutput = res.data;
          console.log('speechOutput: ', speechOutput);
          understandApi.get('user/' + self.user + '/sentence/translate/')
            .then(function(res) {
              speechOutput = res.data;
              console.log('speechOutput: ', speechOutput);


              speechOutput = understandApi.get('user/' + self.user + '/explain/')
                .then(function(res) {
                  speechOutput = res.data;
                  console.log('explain speechOutput: ', speechOutput);

                  understandApi.post('user/' + self.user + '/explain/resolve/yes/')
                    .then(function(res) {
                      speechOutput = res.data;
                      console.log('speechOutput: ', speechOutput);

                      understandApi.post('user/' + self.user + '/explain/resolve/no/')
                        .then(function(res) {
                          speechOutput = res.data;
                          console.log('speechOutput: ', speechOutput);

                          understandApi.get('user/' + self.user + '/repeat/')
                            .then(function(res) {
                              speechOutput = res.data;
                              console.log('speechOutput: ', speechOutput);


                            })
                            .catch(handleError.bind(self));
                        })
                        .catch(handleError.bind(self));
                    })
                    .catch(handleError.bind(self));
                })
                .catch(handleError.bind(self));
            })
            .catch(handleError.bind(self));

        });


//      understandApi.get('user/' + this.user + '/sentence/translate/')
//        .then(function(res) {
//          speechOutput = res.data;
//          console.log('speechOutput: ', speechOutput);
//        })
//        .catch(function(error) {
//          console.log('error: ', error);
//        });
//      understandApi.get('user/' + this.user + '/sentence/next/')
//        .then(function(res) {
//          speechOutput = res.data;
//          console.log('speechOutput: ', speechOutput);
//        })
//        .catch(function(error) {
//          console.log('error: ', error);
//        });
//      understandApi.post('user/' + this.user + '/explain/resolve/yes/')
//        .then(function(res) {
//          speechOutput = res.data;
//          console.log('speechOutput: ', speechOutput);
//        }).catch(function(error) {
//        console.log('error: ', error);
//      });
//      understandApi.post('user/' + this.user + '/explain/resolve/no/')
//        .then(function(res) {
//          speechOutput = res.data;
//          console.log('speechOutput: ', speechOutput);
//        }).catch(function(error) {
//        console.log('error: ', error);
//        });
    },
    methods: {}
  }
</script>

<style lang="stylus">
  .heading
    background blue
</style>

