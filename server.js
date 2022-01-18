'use strict';

const express = require("express");
const got = require("got");
const bodyParser = require("body-parser");

// Constants
const PORT = process.env.PORT;
const HOST = "0.0.0.0";

// App
const router = express.Router();
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/",router);

router.get("/api/auth/:code/:grantType", async function(req, res) {
	var result = {
		access_token: "",
		refresh_token: ""
	};
	  
	var auth_type = "code"
	const auth_code = req.params.code;
	const grant_type = req.params.grantType;
	if(grant_type === "refresh_token") {
		auth_type = grant_type;
	}
	
	await got.post(`https://www.strava.com/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&${auth_type}=${auth_code}&grant_type=${grant_type}`, { 
		json: true,
	}).then(response => {
		result.access_token = response.body.access_token;
		result.refresh_token = response.body.refresh_token;
	}).catch(error => {
  		console.log("error: " + error);
	});
	
	res.send(JSON.stringify(result));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);