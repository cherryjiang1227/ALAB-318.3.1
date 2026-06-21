// ALAB 318.3.1: Expanding a RESTful API

// Part 1: Exploring Existing Routes
// Take a few minutes to explore the existing code again. Make sure that you are familiar with the structure and functionality of what you will be working with. Whenever you are given somebody else's code to work on, it is important to take the appropriate time to understand it before attempting modifications and improvements.
// The application has the following routes as a starting point:
// GET / 
// GET /api
// GET /api/users
// POST /api/users
// GET /api/users/:id
// PATCH /api/users/:id
// DELETE /api/users/:id
// GET /api/posts
// POST /api/posts
// GET /api/posts/:id
// PATCH /api/posts/:id
// DELETE /api/posts/:id

// Part 2: Adding Additional Routes (see data/routes folder)
import express from 'express'
import users from './routes/users.js'
import posts from './routes/posts.js'
import comments from "./routes/comments.js";
import error from './utilities/error.js'
const app = express();
const port = 3000;

// Parsing Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Logging Middlewaare
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys.
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
  var key = req.query["api-key"];

  // Check for the absence of a key.
  if (!key) next(error(400, "API Key Required"));

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);

// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});

// Part 3: Testing
// Test your routes!
// Make sure that everything works as expected, and remember that any changes to the data will be reset when the server restarts since we are not using a persistent database.
// If code does not work, leave comments for yourself explaining potential next steps so you can revisit the application in the future and approach the problem again from a new perspective.
// If code prevents the application from running, comment it out before submission.

// Part 4: Completion
// Upload your project to a GitHub repository, and submit it according to the submission instructions at the beginning of this document.