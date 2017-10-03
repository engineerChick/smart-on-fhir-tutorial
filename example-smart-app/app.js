

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        name: 'Snow, John',
        sex: 'Female',
        age: 30,
        dob: '26 Dec 1986',
        street: 'Cave Quarter Drive',
        city: 'charles town',
        state: 'WV',
        zipCode: '25414',
        district: 'jefferson',
        country: 'USA',
        home: '304-261-5555',
        mobile: '304-489-5555',
        work: '304-876-5555',
        answer: 'amazon',
        days: '5',
        answer: 'yes',
        swelling: 'no',
        glucose: 90,
        systolic: 120,
        diastolic: 80,
        steps: '5500 steps',
        weight: '175 pounds',
        timeStamp: '5:30',
        items: []
    },

    methods: {
        User: function() {
            return this.user = 'fname' + 'lname';
        },
        updateDemographics: function() {
            var body = {
                sessionId: "amzn1.ask.account.AFB7OWNRAC2GATNPXS2O2D7P2Y3SYHWXOZ3RITYBXTIMKBP5E4Y3KXYMJOZ55G3LAT5BCZBYFGCA7DMAR2NQMM7NHIK2IT43N6NRXF36LPO3IATTLIQHYT5TPEO3VQ6BIN4Z7SIGBJ57247QTZGG2Y7YOP4ITT2LEVCEI6CF4J6SSQM3V3KE63464OQLBC2WOWDLM2SKMYZR2EQ",
                sessionTableName: "KRM_Survey",
                surveyTableName: "surveyResponses"
            };
            request('POST', 'https://cors-anywhere.herokuapp.com/https://ne5q2c9xz1.execute-api.us-east-1.amazonaws.com/Prod/usersurveyinfo', {
                json: body
            }).getBody('utf8').then(JSON.parse).done(function(res) {
                console.log(res);
                var unique = _.uniqBy(res.Items, function(o) {
                    return o.questionKey.S;
                });


            _.each(unique, function(row) {
                    var rowObj = {};
                    rowObj.question = _.replace(_.get(row, 'question.S'), /['"]+/g, '');
                    rowObj.questionKey = _.replace(_.get(row, 'questionKey.S'), /['"]+/g, '');
                    rowObj.answer = _.replace(_.get(row, 'response.S'), /['"]+/g, '');
                    var tmp = moment.unix(_.get(row, 'createdOn.S')/1000);
                    var day = tmp.format('MM-DD-YYYY' + ' ' + 'HH:mm');
                    console.log(day);
                    // if ((day.substr(day.length - 5, 2)) < 12) {
                    //     day += 'am';
                    // } else {
                    //     day += 'pm';
                    // }

                    rowObj.lastDay = moment(day).fromNow();

                    rowObj.date = day;
                    console.log(day);
                    console.log('row answer' + rowObj.answer);

                    if(rowObj.questionKey !== 'StartSurvey') {
                        app.items.push(rowObj);
                    }

                });
                console.log(app.items);
            });
        }

    }
});
app.updateDemographics();
