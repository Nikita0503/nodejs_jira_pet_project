const { Type } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function formType(id) {
    const type = await Type.findById(id).select('-createdAt -updatedAt');
    if (!type) {
        throw ApiError.internal(`Type with id '${id}' not found`);
    }
    return type;
}

class TypeService {
    async getAllTypes() {
        const types = await Type.find().select('-createdAt -updatedAt');
        return types;
    }

    async createType(title, color) {
        const candidate = await Type.findOne({ title: title.toString() });
        if (candidate) {
            throw ApiError.internal(`Type with title '${title}' already exists`);
        }
        const type = await Type.create({ title, color });
        return await formType(type._id);
    }

    async editType(typeId, title, color) {
        let type = await Type.findById(typeId);
        if (!type) {
            throw ApiError.internal(`Type with id '${typeId}' not found`);
        }
        if (title) {
            const existingType = await Type.findOne({ title: title.toString(), _id: { $ne: typeId } });
            if (existingType) {
                throw ApiError.internal(`Type with title '${title}' already exists`);
            }
        }
        await Type.updateOne({ _id: typeId }, { title, color });
        return await formType(typeId);
    }

    async deleteType(typeId) {
        const type = await Type.findById(typeId);
        if (!type) {
            throw ApiError.internal(`Type with id '${typeId}' not found`);
        }
        const deletedType = await Type.deleteOne({ _id: typeId });
        return deletedType.deletedCount > 0;
    }
}

module.exports = new TypeService();
