const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String },
});

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeTracked: { type: Number },
    timeAllotted: { type: Number },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    status: { type: Schema.Types.ObjectId, ref: 'Status' },
    type: { type: Schema.Types.ObjectId, ref: 'Type' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const CommentSchema = new Schema({
    message: { type: String, required: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const FileSchema = new Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
});

const StatusSchema = new Schema({
    title: { type: String, unique: true, required: true },
    color: { type: String, required: true }
});

const TypeSchema = new Schema({
    title: { type: String, unique: true, required: true },
    color: { type: String, required: true }
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' },
    avatar: { type: String }
});

const ProjectUserSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Project = mongoose.model('Project', ProjectSchema);
const Task = mongoose.model('Task', TaskSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const File = mongoose.model('File', FileSchema);
const Status = mongoose.model('Status', StatusSchema);
const Type = mongoose.model('Type', TypeSchema);
const User = mongoose.model('User', UserSchema);
const ProjectUser = mongoose.model('ProjectUser', ProjectUserSchema);

module.exports = {
    Project,
    Task,
    Comment,
    Status,
    Type,
    User,
    File,
    ProjectUser
};
