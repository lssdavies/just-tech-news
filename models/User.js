//imported the Model class and DataTypes object from Sequelize.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
//importing bcrypt to hash the password
const bcrypt = require("bcrypt");

// create our User model
//This Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configuration
//Once we create the User class, we use the .init() method to initialize the model's data and configuration, passing in two objects as arguments.
User.init(
  {
    // define an id column
    id: {
      // use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      // this is the equivalent of SQL's `NOT NULL` option
      allowNull: false,
      // instruct that this is the Primary Key
      primaryKey: true,
      // turn on auto increment
      autoIncrement: true,
    },
    // define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be any duplicate email values in this table
      unique: true,
      // if allowNull is set to false, we can run our data through validators before creating the table data
      validate: {
        isEmail: true,
      },
    },
    // define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // this means the password must be at least four characters long
        len: [4],
      },
    },
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality when user is being created to hash password
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // set up beforeUpdate lifecycle "hook" functionality when user is being updated to hash password
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);
/*Notice that the hooks property was added to the second object in User.init().  hooks have semantic names that declare when they can be called. In our case, we need a hook that will fire just before a new instance of User is created. The beforeCreate() hook is the correct choice. the beforeCreate() hook to execute the bcrypt hash function on the plaintext password. In the bcrypt hash function, we pass in the userData object that contains the plaintext password in the password property. We also pass in a saltRound value of 10.

The resulting hashed password is then passed to the Promise object as a newUserData object with a hashed password property. The return statement then exits out of the function, returning the hashed password in the newUserData function.

That seems a bit complex for such a simple async function. Notice how we needed to create two different local variables, userData and newUserData? It's a bit clunky and hard to follow due to the two variables that store the pre-hash and post-hash data, userData and newUserData, respectively.

Good thing there is another method to handle async functions that will make the code more concise and legible. We will use the async/await syntax to replace the Promise.

Let's replace the function above using Promises with the new version of the exact same functionality with the async/await syntax

Since we are using hookd we must add an option to the query call. According to the Sequelize documentation regarding the beforeUpdate (Links to an external site.), we will need to add the option { individualHooks: true }.*/

module.exports = User;