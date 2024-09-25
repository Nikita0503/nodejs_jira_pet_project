const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const options = {
    _id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};

const ProjectSchema = new Schema({
    _id: Number,
    title: { type: String, unique: true, required: true },
    description: { type: String }
}, options);

ProjectSchema.virtual('id').get(function () {
    return this._id;
});

const TaskSchema = new Schema({
    _id: Number,
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeTracked: { type: Number },
    timeAllotted: { type: Number },
    project: { type: Number, ref: 'Project' },
    status: { type: Number, ref: 'Status' },
    type: { type: Number, ref: 'Type' },
    user: { type: Number, ref: 'User' }
}, options);

TaskSchema.virtual('id').get(function () {
    return this._id;
});

const CommentSchema = new Schema({
    _id: Number,
    message: { type: String, required: true },
    task: { type: Number, ref: 'Task' },
    user: { type: Number, ref: 'User' }
}, options);

CommentSchema.virtual('id').get(function () {
    return this._id;
});

const FileSchema = new Schema({
    _id: Number,
    name: { type: String, required: true },
    path: { type: String, required: true },
    task: { type: Number, ref: 'Task' },
    comment: { type: Number, ref: 'Comment' }
}, options);

FileSchema.virtual('id').get(function () {
    return this._id;
});

const StatusSchema = new Schema({
    _id: Number,
    title: { type: String, unique: true, required: true },
    color: { type: String, required: true }
}, options);

StatusSchema.virtual('id').get(function () {
    return this._id;
});

const TypeSchema = new Schema({
    _id: Number,
    title: { type: String, unique: true, required: true },
    color: { type: String, required: true }
}, options);

TypeSchema.virtual('id').get(function () {
    return this._id;
});

const UserSchema = new Schema({
    _id: Number,
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' },
    avatar: { type: String }
}, options);

UserSchema.virtual('id').get(function () {
    return this._id;
});

const ProjectUserSchema = new Schema({
    _id: Number,
    project: { type: Number, ref: 'Project' },
    user: { type: Number, ref: 'User' }
}, options);

ProjectUserSchema.virtual('id').get(function () {
    return this._id;
});

ProjectSchema.plugin(AutoIncrement, { id: 'project_counter', inc_field: '_id' });
TaskSchema.plugin(AutoIncrement, { id: 'task_counter', inc_field: '_id' });
CommentSchema.plugin(AutoIncrement, { id: 'comment_counter', inc_field: '_id' });
FileSchema.plugin(AutoIncrement, { id: 'file_counter', inc_field: '_id' });
StatusSchema.plugin(AutoIncrement, { id: 'status_counter', inc_field: '_id' });
TypeSchema.plugin(AutoIncrement, { id: 'type_counter', inc_field: '_id' });
UserSchema.plugin(AutoIncrement, { id: 'user_counter', inc_field: '_id' });
ProjectUserSchema.plugin(AutoIncrement, { id: 'project_user_counter', inc_field: '_id' });

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
