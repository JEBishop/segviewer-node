'use strict';

const express = require('express');
const got = require('got');

// Constants
const PORT = process.env.PORT;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.static('public'))

app.post('/api/auth/:code', (req, res) => {
	var result;
	const auth_code = req.params.code;
	got('https://www.strava.com/oauth/token', { 
		json: true,
		searchParams: {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: auth_code,
			grant_type: "authorization_code"
		}
	}).then(response => {
		result["access_token"] = response.body.access_token;
		result["refresh_token"] = response.body.refresh_token;
	}).catch(error => {
  		console.log(error.response.body);
	});
	res.send(JSON.stringify(result));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);