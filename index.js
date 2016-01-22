var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://api-ssl.bitly.com/'
});

var pickInputs = {
        'longUrl': 'longUrl',
        'domain': 'domain'
    },
    pickOutputs = {
        'new_hash': 'data.new_hash',
        'url': 'data.url',
        'hash': 'data.hash',
        'global_hash': 'data.global_hash',
        'long_url': 'data.long_url'
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            token = dexter.provider('bitly').credentials('access_token'),
            api = '/v3/shorten';

        if (validateErrors)
            return this.fail(validateErrors);

        inputs.access_token = token;
        request.get({uri: api, qs: inputs, json: true}, function (error, response, body) {
            if (error || (body && body.status_code !== 200))
                this.fail(error || body);
            else
                this.complete(util.pickOutputs(body, pickOutputs));
        }.bind(this));
    }
};
