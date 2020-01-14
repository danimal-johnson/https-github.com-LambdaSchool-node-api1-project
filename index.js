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
  res.send({ api: 'Up and running...'});
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
// Response for unknown user may not be correct
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

// ** Add a new user (POST)
server.post('/api/users', (req, res) => {
  const userData = req.body;
  console.log("Attempting to add user:", userData);
  if( !userData.name || !userData.bio ) {
    res.status(400).json({ 
      errorMessage : "Please provide name and bio for the user."
    })
  }
  else { 
    db.insert(userData)
      .then(user => {
        res.status(201).json(user); // Is this the NEWLY CREATED version?
      })
      .catch(err => {
        console.log("Error on POST /api/users:", err);
        res.status(500).json({
          errorMessage: "There was an error while saving the user to the database"
        });
      })
  }
});

// ** MODIFY a user (PUT) **
// Fully functional
server.put('/api/users/:id', (req, res) => {
  let id = req.params.id;
  const userData = req.body;

  if ( !userData.name || !userData.bio ) { // Both fields are required
    res.status(400).json({
      errorMessage: "Please provide name and bio for the user."
    })
  }
  else{
    db.update(id, userData)
    .then (updated => {
      if (updated) {
        db.findById(id)
          .then(user => res.status(200).json(user)); // Is this robust enough?
        // res.status(200).json(userData); // Doesn't return new object
      }
      else {
        res.status(404).json({
          errorMessage: "The user information could not be modified."
        });
      }
    });
  }
});

// ** DELETE a user **
// Fully functional
server.delete('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.remove(id)
    .then(removed => {
      if(removed) {
        res.status(200).json({
          message: `User ID ${id} successfully deleted`
        });
      }
      else {
        res.status(404).json({message: "The user with the specified ID does not exist."})
      }
    })
    .catch(err => {
      console.log(`Error deleting ${id}: ${err}`);
      res.status(500).json({
          errorMessage: "The user could not be removed"
        });
    });

});


// Start up the server
server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});