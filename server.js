const express = require("express");
const Datastore = require("nedb");

const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");

const session = require("express-session");
const { request } = require("http");

const app = express();
app.listen(3000, () => console.log("Server listening..."));
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		secret: "u2134234hkfljsdl320fhsd",
		resave: false,
		saveUninitialized: true,
	})
);

const users = new Datastore("./databases/users.db");
const rf2_cars = new Datastore("./databases/rf2_cars.db");
const rf2_tracks = new Datastore("./databases/rf2_tracks.db");
users.loadDatabase();
rf2_cars.loadDatabase();
rf2_tracks.loadDatabase();

// Load the dashboard if there is a session
app.get("/dashboard", (request, response) => {
	if (!request.session.user) {
		return response.status(401).send();
	}
	return response.sendFile(path.join(__dirname + "/dashboard.html"));
});
// Load the register page 
app.get("/change-password", (request, response) => {
	if (!request.session.user) {
		return response.status(401).send();
	}
	return response.sendFile(path.join(__dirname + "/change-password.html"));
});
// Load the admin page 
app.get("/admin", (request, response) => {
	if (!request.session.user) {
		//return response.status(401).send();
        return response.sendFile(path.join(__dirname + "/public/login.html"));
	}
	return response.sendFile(path.join(__dirname + "/admin.html"));
});

// Load the login page
app.get("/login", (request, response) => {
	if (request.session.user) {
		//return response.status(401).send();
        return response.sendFile(path.join(__dirname + "/dashboard.html"));
	}
	return response.sendFile(path.join(__dirname + "/public/login.html"));
});

// Handle registration form
app.post("/register", async (request, response) => {
	try {
		users.find({ username: request.body.username }, async (error, data) => {
			if (error) {
				response.end();
				return 0;
			}

			if (Object.keys(data).length === 0) {
				const hashPassword = await bcrypt.hash(
					request.body.password,
					10
				);
				const newUser = {
					username: request.body.username,
					password: hashPassword,
				};

				users.insert(newUser);
				console.log("Registered user:", request.body.username);
				return response.redirect("login.html");
			} else {
				console.log(request.body.username + " is already registered");
				return response.redirect("login.html");
			}
		});
	} catch {
		return response.send("Internal server error");
	}
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
				const passwordMatch = await bcrypt.compare(
					request.body.password,
					data[0].password
				);

				if (passwordMatch) {
					console.log("You are now logged in");
					request.session.user = request.body.username;
					return response.redirect("/dashboard");
				} else {
					console.log("Wrong password");
					return response.redirect("./login.html");
				}
			} else {
				console.log("You don't have an account");
				return response.redirect("./login.html");
			}
		});
	} catch {
		return response.send("Internal server error");
	}
});

// Handle logout
app.get("/logout", (request, response) => {
	request.session.destroy(() => response.redirect("/"));
	console.log("User logged out.");
});

app.post("/api", (request, response) => {
	console.log(request.body);

	response.json({
		status: "success",
		data: request.body.data,
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
