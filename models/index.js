const User = require("./User");
const Post = require("./Post");

// create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});
/**
 Defining relations ship between bpoth models; A user can make many posts. But a post only belongs to a single user, and never many users. By this relationship definition, we know we have a one-to-many relationship.
This relations has to be defined index.js file
 */
Post.belongsTo(User, {
  foreignKey: "user_id",
});
/**
 As we referenced earlier, a user can make many posts. Thanks to Sequelize, we can now use JavaScript to explicitly create this relation. This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.

We also need to make the reverse association; In this statement, we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model.
 */



module.exports = { User, Post };
