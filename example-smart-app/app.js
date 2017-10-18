

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        user: {
            street: '555 Cave Road',
            city: 'Charles Town',
            state: 'WV',
            zipCode: '25414',
            district: 'Jefferson',
            country: 'USA',
            home: '304-261-5555',
            mobile: '304-489-5555',
            work: '304-876-5555'
        },
        surveyResponses: [],
        ohcResponses: [],
        surveyLoading: true
    },

    methods: {
        updateDemographics: function() {
            var vueInstance = this;

            var body = {
                sessionId: "amzn1.ask.account.AFB7OWNRAC2GATNPXS2O2D7P2Y3SYHWXOZ3RITYBXTIMKBP5E4Y3KXYMJOZ55G3LAT5BCZBYFGCA7DMAR2NQMM7NHIK2IT43N6NRXF36LPO3IATTLIQHYT5TPEO3VQ6BIN4Z7SIGBJ57247QTZGG2Y7YOP4ITT2LEVCEI6CF4J6SSQM3V3KE63464OQLBC2WOWDLM2SKMYZR2EQ",
                sessionTableName: "KRM_Survey",
                surveyTableName: "surveyResponses"
            };
            request('POST', 'https://ne5q2c9xz1.execute-api.us-east-1.amazonaws.com/Prod/usersurveyinfo', {
                json: body
            }).getBody('utf8').then(JSON.parse).catch(function (err) {
                console.log(err);
                vueInstance.surveyLoading = false;
            }).done(function (res) {
                var unique = _.uniqBy(res.Items, function(o) {
                    return o.questionKey.S;

                });


            _.each(unique, function(row) {
                    var rowObj = {};
                    rowObj.question = _.replace(_.get(row, 'question.S'), /['"]+/g, '');
                    rowObj.questionKey = _.replace(_.get(row, 'questionKey.S'), /['"]+/g, '');
                    rowObj.answer = _.replace(_.get(row, 'response.S'), /['"]+/g, '');
                    var tmp = moment.unix(_.get(row, 'createdOn.S') / 1000);
                    var day = tmp.format('MM-DD-YYYY hh:mm a');

                    rowObj.lastDay = tmp.fromNow();

                    rowObj.date = day;

                    if (rowObj.questionKey !== 'StartSurvey') {
                        vueInstance.surveyResponses.push(rowObj);
                    }

                });
                console.log(vueInstance.surveyResponses);
            vueInstance.surveyLoading = false;
        });
    },

    ohcVitals: function() {
        var vueInstance = this;

        var options = {
    method: 'GET',
    url: 'https://api.eu.apiconnect.ibmcloud.com/csc-healthcare-uk-csc-api-connect/dhp/Patient/ea1bde71-201f-4578-8afa-195f17a3fb61',
    headers: {
        accept: 'application/fhir+json',
        'x-ibm-client-id': 'ea1bde71-201f-4578-8afa-195f17a3fb61Y'
    }
};

request(options, function(error, response, body) {
    if (error) return console.error('Failed: %s', error.message);

    console.log('Success: ', body);
});
        // const url = 'https://api.eu.apiconnect.ibmcloud.com/csc-healthcare-uk-csc-api-connect/dhp/Patient/' + id
        // var config = {
        //     headers: {
        //         'accept': 'application/fhir+json',
        //         'x-ibm-client-id': 'ea1bde71-201f-4578-8afa-195f17a3fb61'
        //     }
        // }
        // axios.get(url, config)
        // .then(function (response) {
        //     var uni = _.uniqBy(response.Items, function(o) {
        //         console.log('o.vitals ' + o.vitals);
        //         return o.vitals;
        //     });

            // _.each(uni, function(row) {
            //         var ohcObj = {};
            //         // rowObj.question = _.replace(_.get(row, 'question.S'), /['"]+/g, '');
            //         // rowObj.questionKey = _.replace(_.get(row, 'questionKey.S'), /['"]+/g, '');
            //         // rowObj.answer = _.replace(_.get(row, 'response.S'), /['"]+/g, '');
            //         //
            //
            //         vueInstance.ohcResponses.push(ohcObj);
            //
            //     });
            //     console.log(vueInstance.ohcResponses);

    }
}
});
app.updateDemographics();
