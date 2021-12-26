const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING}
});

const Task = sequelize.define('task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    timeTracked: {type: DataTypes.BIGINT},
    timeAllotted: {type: DataTypes.BIGINT},
});

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    message: {type: DataTypes.STRING, allowNull: false}
});

const Status = sequelize.define('status', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    color: {type: DataTypes.STRING, allowNull: false}
});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    color: {type: DataTypes.STRING, allowNull: false}
});

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    avatar: {type: DataTypes.STRING},
});

const File = sequelize.define('file', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    path: {type: DataTypes.STRING, allowNull: false}
})

const ProjectUser = sequelize.define('project_user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});


Project.hasMany(Task, {onDelete: 'cascade'});
Task.belongsTo(Project);

Project.belongsToMany(User, {through: ProjectUser});
User.belongsToMany(Project, {through: ProjectUser});

Task.hasMany(Comment, {onDelete: 'cascade'});
Comment.belongsTo(Task);

Task.hasMany(File, {onDelete: 'cascade'});
File.belongsTo(Task);

Comment.hasMany(File, {onDelete: 'cascade'});
File.belongsTo(Comment);

Status.hasMany(Task, {onDelete: 'cascade'});
Task.belongsTo(Status);

Type.hasMany(Task);
Task.belongsTo(Type);

User.hasMany(Task);
Task.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

module.exports = {
    Project,
    Task,
    Comment,
    Status,
    Type,
    User,
    File,
    ProjectUser
}