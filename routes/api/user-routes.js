//import express.Router and User model;l
const router = require("express").Router();
const { User } = require("../../models");

// GET /api/users
//Get all users
router.get("/", (req, res) => {
  // Access our User model and run .findAll() method)
  User.findAll({
    //excludes the password from being returned
  attributes: { exclude: ['password'] }
})
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
/**
 the User model inherits functionality from the Sequelize Model class. .findAll() is one of the Model class's methods. The .findAll() method lets us query all of the users from the user table in the database, and is the JavaScript equivalent of the following SQL query: SELECT * FROM users;

 Sequelize is a JavaScript Promise-based library, meaning we get to use .then() with all of the model methods!
 */


// GET /api/users/1
router.get("/:id", (req, res) => {
  User.findOne({
    //excludes the password from being returned
  attributes: { exclude: ['password'] },
  where: {
    id: req.params.id
  }
})
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
/**
 assing an argument into the .findOne() method, another great benefit of using Sequelize. Instead of writing a hefty SQL query, we can use JavaScript objects to help configure the query! 
 SQl = SELECT FROM users WHERE id = 1

 Because we're looking for one user, there's the possibility that we could accidentally search for a user with a nonexistent id value. Therefore, if the .then() method returns nothing from the query, we send a 404 status back to the client to indicate everything's okay and they just asked for the wrong piece of data.
 */

// POST /api/users
router.post("/", (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
/**
 To insert data, we can use Sequelize's .create() method. Pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from req.body. In SQL, this command would look like the following code:

INSERT INTO users
  (username, email, password)
VALUES
  ("Lernantino", "lernantino@gmail.com", "password1234");
 */

/**
 To update existing data, use both req.body and req.params. Let's update the PUT route to look like the following code:
 */
// PUT /api/users/1
router.put("/:id", (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
/**
 .update() method combines the parameters for creating data and looking up data. We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used. he associated SQL syntax would look like the following code:

UPDATE users
SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
WHERE id = 1;
 */

// DELETE /api/users/1
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
/**
 To delete data, use the .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table.
 */

module.exports = router;
