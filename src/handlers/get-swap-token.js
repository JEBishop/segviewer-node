const got = require("got");
const bodyParser = require("body-parser");

exports.getSwapTokenHandler = async (event) => {
    const { httpMethod, path, pathParameters } = event;
    if (httpMethod !== 'GET') {
        throw new Error(`getMethod only accept GET method, you tried: ${httpMethod}`);
    }

    const auth_code = pathParameters.code;
    const grant_type = pathParameters.grantType;

	var auth_type = "code";
	if(grant_type === "refresh_token") {
		auth_type = grant_type;
	}

    var result = {
		access_token: null,
		refresh_token: null
	};
	
	await got.post(`https://www.strava.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&${auth_type}=${auth_code}&grant_type=${grant_type}`, { 
		json: true,
	}).then(response => {
        console.log(response.body);
		result.access_token = response.body.access_token;
		result.refresh_token = response.body.refresh_token;
	}).catch(error => {
  		console.log("error: " + error);
	});

    console.log("Access: " + result.access_token);
    console.log("Refresh: " + result.refresh_token);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(result),
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
