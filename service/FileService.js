const { File } = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const ApiError = require("../errors/ApiError");

class FileService {

    async attachFile(file, ids){
        const addedFileData = await this.saveFile(file); 
        const fileInfo = await File.create({name: addedFileData.fileName, path: addedFileData.filePath, ...ids})
        return fileInfo.name;
    }

    async saveFile(file){
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve('static', fileName);
        await file.mv(filePath);
        return {fileName, filePath};
    }

    async detachFile(fileId){
        const file = await File.findOne({where: {id: fileId}});
        if(!file){
            throw ApiError.badRequest(`File with id '${fileId}' not found`);
        }
        this.deleteFile(file.name);
        const deletedFileId = File.destroy({where: {id: fileId}});
        return !!deletedFileId;
    }

    async deleteFile(fileName){
        const filePath = path.resolve('static', fileName);
        fs.unlinkSync(filePath);    
    }
}

module.exports = new FileService();