const express = require("express");
const Datastore = require("nedb");

const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");

const session = require("express-session");
const { request } = require("http");

const fileUpload = require("express-fileupload");

// file manipulation
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server listening on " + PORT + "..."));
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		secret: "u2134234hkfljsdl320fhsd",
		resave: false,
		saveUninitialized: true
	})
);
app.use(fileUpload());


// First time load
let users;
let raceEvents;
app.get("/firstTime", (request, response) => {
    if(fs.existsSync("./databases/users.db")){
        users = new Datastore("./databases/users.db");
        users.loadDatabase();

        raceEvents = new Datastore("./databases/raceEvents.db");
        raceEvents.loadDatabase();
    }
    else{
        console.log("First time loading, need to setup the admin account. User redirected.");
        response.json({
            status: "success",
            value: true
        });

        raceEvents = new Datastore("./databases/raceEvents.db");
        raceEvents.loadDatabase();
    }
    return;
});
app.get("/firstTimeSetup", (request, response) => {
    // 2x security (need to start somewhere)
    if(!fs.existsSync("./databases/users.db")){
        return response.sendFile(path.join(__dirname + "/firstTimeSetup.html"));
    }
});

app.post("/setCredentials", async (request, response) => {
    users = new Datastore("./databases/users.db");
    users.loadDatabase();


    const hashPassword = await bcrypt.hash(request.body.password, 10);
    const newUser = {
        username: request.body.username,
        password: hashPassword
    };

    users.insert(newUser);
    console.log("Registered user:", request.body.username);
    return response.redirect("/");
});



// Load the dashboard if there is a session
app.get("/dashboard", (request, response) => {
	if (!request.session.user) {
		//return response.sendFile(path.join(__dirname + "/public/login.html"));
		//return response.status(401).send();
        return response.redirect("/login");
	}
	return response.sendFile(path.join(__dirname + "/dashboard.html"));
});
// Load the admin page
app.get("/admin", (request, response) => {
	if (!request.session.user) {
		//return response.status(401).send();
		//return response.sendFile(path.join(__dirname + "/public/login.html"));
        return response.redirect("/login");
	}
	return response.sendFile(path.join(__dirname + "/admin.html"));
});

// Load the login page
app.get("/login", (request, response) => {
	if (request.session.user) {
        return response.redirect("/dashboard");
	}
	return response.sendFile(path.join(__dirname + "/public/login.html"));
});
// Load the login page informing user of a wrong password
app.get("/loginErrPass", (request, response) => {
	if (request.session.user) {
        return response.redirect("/dashboard");
	}
	return response.sendFile(path.join(__dirname + "/public/loginErrPass.html"));
});
// Load the login page informing the user of a wrong account
app.get("/loginErrAcc", (request, response) => {
	if (request.session.user) {
        return response.redirect("/dashboard");
	}
	return response.sendFile(path.join(__dirname + "/public/loginErrAcc.html"));
});


// Handle login form
app.post("/login", (request, response) => {
	try {
		users.find({ username: request.body.username }, async (error, data) => {
			if (error) {
				response.end();
				return 0;
			}

			if (Object.keys(data).length > 0) {
				const passwordMatch = await bcrypt.compare(request.body.password, data[0].password);

				if (passwordMatch) {
					console.log("You are now logged in");
					request.session.user = request.body.username;
					return response.redirect("/admin");
				} else {
					console.log("Wrong password");
					//return response.redirect("./login.html");
                    return response.redirect("/loginErrPass");
				}
			} else {
				console.log("You don't have an account");
                //return response.send("no account");
				return response.redirect("/loginErrAcc");
			}
		});
	} catch {
		return response.send("Internal server error");
	}
});

//// Handle registration form
//app.post("/register", async (request, response) => {
	//try {
		//users.find({ username: request.body.username }, async (error, data) => {
			//if (error) {
				//response.end();
				//return 0;
			//}

			//if (Object.keys(data).length === 0) {
				//const hashPassword = await bcrypt.hash(request.body.password, 10);
				//const newUser = {
					//username: request.body.username,
					//password: hashPassword
				//};

				//users.insert(newUser);
				//console.log("Registered user:", request.body.username);
				//return response.redirect("login.html");
			//} else {
				//console.log(request.body.username + " is already registered");
				//return response.redirect("login.html");
			//}
		//});
	//} catch {
		//return response.send("Internal server error");
	//}
//});

// Image upload
const imgPath = __dirname + "/public/assets/events-img/";
app.post("/store-img", (request, response) => {
	const image = request.files.myFile;
    //console.log(image);
	const id = request.body.id;
	const type = request.body.type;
	const name = id + "-" + type + ".png";
	const path = imgPath + name;

	image.mv(path, (error) => {
		if (error) {
			console.error(error);
			response.writeHead(500, {
				"Content-Type": "application/json"
			});
			response.end(JSON.stringify({ status: "error", message: error }));
			return;
		}

		response.writeHead(200, {
			"Content-Type": "application/json"
		});
		response.end(JSON.stringify({ status: "success", name: name }));
	});
});

// Handle logout
app.get("/logout", (request, response) => {
	request.session.destroy(() => response.redirect("/"));
	console.log("User logged out.");
});













app.post("/newRaceEvent", (request, response) => {
	const data = request.body;
	delete data._id;

	let id = { _id: "0" };
	raceEvents.insert(data, (err, newDoc) => {
		id._id = newDoc._id;
        console.log("new RaceEvent", id._id);
		response.json(id);
	});
});
// Is never called
app.post("/update", (request, response) => {
	const data = request.body;

	const id = data._id;
	delete data._id;

	raceEvents.update({ _id: id }, data, {}, async (err, numReplaced) => {
		if (err) {
			console.log(err);
			response.json({ success: "false" });
			return 0;
		}
		console.log(id + ": Entry updated.");
		response.json({ success: "true" });
	});

    raceEvents.findOne({ _id: id }, (err, doc) => {
        console.log(doc);
    });
});
app.post("/remove", (request, response) => {
	const id = request.body._id;
    console.log(id);

	raceEvents.remove({ _id: id }, { multi: true }, async (err, numReplaced) => {
		if (err) {
			console.log(err);
			response.json({ success: "false" });
			return 0;
		}
		console.log(id + " : Entry removed.");
		response.json({ success: "true" });
	});

    //raceEvents.find({_id: id}, (err, docs) => {
        //console.log(docs);
    //});
});
app.get("/loadEvent", (request, response) => {
    raceEvents.find({}, (err, docs) => {
        //console.log(docs);
        console.log("Saved raceEvents sent");
        const raceEvents = docs;

        response.json({array: raceEvents});
    });

});










app.post("/api", (request, response) => {
	console.log(request.body);

	response.json({
		status: "success",
		data: request.body.data
	});
});

// Read database and send it as a json
app.get("/rf2_cars", (request, response) => {
	rf2_cars.find({}, (error, data) => {
		if (error) {
			response.end();
			return 0;
		}
		response.json(data);
	});
});

// Read database and send it as a json
app.get("/rf2_tracks", (request, response) => {
	rf2_tracks.find({}, (error, data) => {
		if (error) {
			response.end();
			return 0;
		}
		response.json(data);
	});
});
