const { Status, Task } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function formStatus(id) {
    const status = await Status.findById(id).select('-createdAt -updatedAt');
    if (!status) {
        throw ApiError.badRequest(`Status with id '${id}' not found`);
    }
    return status;
}

class StatusService {
    async getAllStatuses() {
        const statuses = await Status.find().select('-createdAt -updatedAt');
        return statuses;
    }

    async createStatus(title, color) {
        const candidate = await Status.findOne({ title: title.toString() });
        if (candidate) {
            throw ApiError.internal(`Status with title '${title}' already exists`);
        }
        const status = await Status.create({ title, color });
        return await formStatus(status._id);
    }

    async editStatus(statusId, title, color) {
        let status = await Status.findById(statusId);
        if (!status) {
            throw ApiError.badRequest(`Status with id '${statusId}' not found`);
        }
        if (title) {
            const existingStatus = await Status.findOne({ title: title.toString(), _id: { $ne: statusId } });
            if (existingStatus) {
                throw ApiError.internal(`Status with title '${title}' already exists`);
            }
        }
        await Status.updateOne({ _id: statusId }, { title, color });
        return await formStatus(statusId);
    }

    async deleteStatus(statusId) {
        const status = await Status.findById(statusId);
        if (!status) {
            throw ApiError.badRequest(`Status with id '${statusId}' not found`);
        }
        const deletedStatus = await Status.deleteOne({ _id: statusId });
        return deletedStatus.deletedCount > 0;
    }
}

module.exports = new StatusService();
