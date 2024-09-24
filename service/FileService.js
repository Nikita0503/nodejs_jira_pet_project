const { File } = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const ApiError = require("../errors/ApiError");

class FileService {
    async attachFile(file, ids) {
        const addedFileData = await this.saveFile(file); 
        const fileInfo = await File.create({ name: addedFileData.fileName, path: addedFileData.filePath, ...ids });
        return fileInfo.name;
    }

    async saveFile(file) {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve('static', fileName);
        await file.mv(filePath);
        return { fileName, filePath };
    }

    async detachFile(fileId) {
        const file = await File.findById(fileId);
        if (!file) {
            throw ApiError.badRequest(`File with id '${fileId}' not found`);
        }
        await this.deleteFile(file.name);
        const deletedFile = await File.deleteOne({ _id: fileId });
        return deletedFile.deletedCount > 0;
    }

    async deleteFile(fileName) {
        const filePath = path.resolve('static', fileName);
        fs.unlinkSync(filePath);    
    }
}

module.exports = new FileService();
