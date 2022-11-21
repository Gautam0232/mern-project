const express = require("express"); // Import express
const path = require("path");  // Import path
const app = express();  // Invoke express function
const hbs = require("hbs"); // Import the handle bars module
require("./db/conn"); // Import the connection module containing mongoose connection

const Register = require("./models/registers");
const Login = require("./models/login");

const port = process.env.PORT || 3000; // Assign a port

const static_path = path.join(__dirname, "../public"); // Create a static path to serve your static files
const template_path = path.join(__dirname, "../templates/views"); // Same in the case of views and partials
const partials_path = path.join(__dirname, "../templates/partials"); 

app.use(express.json()); // Function to parse the JSON request
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path)); // Function to serve the static files

app.set("view engine", "hbs"); // Set a view engine , in this case using handlebars (hbs)
app.set("views", template_path); // Similarly for template path

hbs.registerPartials(partials_path); // Initialize all partials


// Work on a get request
app.get("/", (req, res) => {
    res.render("index") // Render the home (index) page
});

app.get("/register", (req, res) => {
    res.render("register"); // Render the registration page
});

app.get("/login", (req, res) => {
    res.render("login"); // Render the login page
})

// Listen to a particular assigned port
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});

// let's create a new user in our database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        // Condition to match the password
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            // Save the data to the mongoose collection
            const registered = await registerEmployee.save();

            // Go back to the index page
            res.status(201).render("index");
        } else {
            // Error if passwords not matching
            res.send("passwords are not matching");
        }
    } catch (error) {
        // Return an error
        res.status(400).send(error);
    }
});

// Handle the login request
app.post("/login", async (req, res) => {

    try {
        const email = req.body.email;

        const user = await Register.findOne({ email: email });
        if (user == null) {
            res.send("User not found!");
        }
        else {
            res.send("Logged in successfully!");
        }
    } catch (err) {
        res.status(400).send(error);
    }
});
