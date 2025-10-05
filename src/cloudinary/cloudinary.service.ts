import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse | UploadApiErrorResponse> {
    try {
      const uploadFile = new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            resolve(result as CloudinaryResponse);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      return uploadFile;
    } catch (e) {
      return ({
        message: 'Error al subir la imagen',
        name: 'Error al subir la imagen',
        http_code: 500,
      }) as UploadApiErrorResponse;
    }
  }

  async uploadFiles(files: Express.Multer.File[]) {
    try {
      const promises = files.map(file => this.uploadFile(file));
      await Promise.all(promises);
      return { ok: true, msg: 'Imagenes Almacenadas en el servidor' };
    } catch (e) {
      // console.log(e);
      return { ok: false, msg: 'Error on Image server' };
    }
  }

}
