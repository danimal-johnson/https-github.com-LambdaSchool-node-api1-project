// implement your API here
const express = require('express');
const db=require('./data/db.js');

const server = express();
const port = 4000;

// ** Middleware **
server.use(express.json());
// server.use(cors());

// ** Test that the server is working **
server.get('/', (req, res) => {
  res.send({ api: 'Up and running...'})
});

// ** GET all users **
// Fully functional
server.get('/api/users', (req, res) => {
  db.find() // Gets all entries
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("Error getting /api/users :", err);
      res.status(500)
        .json({ message: "The users information could not be retrieved." });
    });
});

// ** GET a specific user **
server.get('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.findById(id) // Get commands from /data/db.js file
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        console.log(`Error getting /api/user/${id}: ${err}`);
        res.status(404)
          .json({ message: "The user with the specified ID does not exist." });  
      }
    })
    .catch(err => {
      console.log("Server error on GET /api/user/:id");
      res.status(500).json({ error: "The user information could not be retrieved."});
    });
});


// Start up the server
server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});