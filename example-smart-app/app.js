

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        user: {
            name: 'Joe',
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
        ohcVitals: [],
        surveyLoading: true,
        ohcLoading: true
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
                console.log(res);
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

    ohcPatient: function() {
        var vueInstance = this;

        var options = {
            'x-ibm-client-id': 'ea1bde71-201f-4578-8afa-195f17a3fb61',
            accept: 'application/fhir+json'
        };
        request('GET', 'https://api.eu.apiconnect.ibmcloud.com/csc-healthcare-uk-csc-api-connect/dhp/Patient/1234', {
            headers: options
        }).getBody('utf8').then(JSON.parse).catch(function (err) {
            console.log(err);
            vueInstance.ohcLoading = false;
        }).done(function (res) {
            console.log(res);
            var firstName = _.get(res, 'name[0].given[0]');
            var lastName = _.get(res, 'name[0].family')
            console.log(firstName);
            var ohcObj = {};
            ohcObj.name = lastName +', '+ firstName;
            ohcObj.gender = _.get(res, 'gender');
            ohcObj.birthDate = _.get(res, 'birthDate');
            console.log(ohcObj);
            vueInstance.ohcResponses.push(ohcObj);
            console.log(vueInstance.ohcResponses);
            vueInstance.ohcLoading = false;

        });

    },

    ohcObservation: function() {
        var vueInstance = this;

        var options = {
            'x-ibm-client-id': 'ea1bde71-201f-4578-8afa-195f17a3fb61',
            accept: 'application/fhir+json'
        };
        request('GET', 'https://api.eu.apiconnect.ibmcloud.com/csc-healthcare-uk-csc-api-connect/dhp/Patient/1234/Observation', {
            headers: options
        }).getBody('utf8').then(JSON.parse).catch(function (err) {
            console.log(err);
            vueInstance.surveyLoading = false;
        }).done(function (res) {
            console.log(res);
            var ohcObj = {};
            // vueInstance.ohcVitals.push(ohcObj);
            // console.log(vueInstance.ohcVitals);

            _.each(res.entry, function(row) {
                    var rowObj = {};
                    // rowObj.response = _.get(row, 'response');
                    //rowObj.resource = _.get(row, 'resource.code.coding');
                    var display = _.get(row, 'resource.code.coding[0].display');
                    console.log(display);
                    if(display == "Diastolic"){
                    rowObj.resource = _.get(row, 'resource');
                }
                    // rowObj.code = _.get(row, 'code.coding[0].code');
                    vueInstance.ohcVitals.push(rowObj);


                });
                console.log(vueInstance.ohcVitals);
            vueInstance.surveyLoading = false;

        });
    }
}
});
app.updateDemographics();
app.ohcPatient();
app.ohcObservation();
