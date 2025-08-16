import { Injectable } from '@nestjs/common';
import StorageFiles from 'src/utils/cloud_storage';

@Injectable()
export class FilesService {

    async uploadFile(file: Express.Multer.File, path: string = 'avatar') {
        try {
            // console.log(file);
            const url = await StorageFiles.storageFile(file, file.originalname, path);
            // console.log(url);
            if (!url) return { ok: false, msg: 'La imagen no se pudo guardar' };
            return { ok: true, url, msg: 'Imagen Almacenada en el servidor' };
        } catch (e) {
            console.log(e);
            return {
                ok: false,
                msg: 'Error on Image server'
            }
        }
    }

    async deleteFile(pathImage: string) {
        try {
            const result = await StorageFiles.deleteFile(pathImage);
            return result;
        } catch (e) {
            console.log(e);
            return {
                ok: false,
                msg: 'Error on Image server'
            }
        }
    }
}
