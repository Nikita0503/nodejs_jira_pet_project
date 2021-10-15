const { File } = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const ApiError = require("../errors/ApiError");

class FileService {

    async saveFile(file, ids){
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve('static', fileName);
        file.mv(filePath);
        const fileInfo = await File.create({name: fileName, path: filePath, ...ids})
        return fileInfo.name;
    }
  
    async deleteFile(fileId){
        const file = await File.findOne({where: {id: fileId}});
        if(!file){
            throw ApiError.badRequest(`File with id '${fileId}' not found`);
        }
        const filePath = path.resolve('static', file.name);
        fs.unlinkSync(filePath);        
        const deletedFileId = File.destroy({where: {id: fileId}});
        return !!deletedFileId;
    }
}

module.exports = new FileService();