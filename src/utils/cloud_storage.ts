import { Storage } from '@google-cloud/storage';
import { format } from 'util';
// import url from 'url';
// const env = require('../config/env');
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();



const storageFile = (file, pathImage, carpetaName): Promise<string> => {
    function getGoogleCredentials() {
        // if (!process.env.FIREBASE_CREDENTIAL_JSON) return;
        const jsonObject = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON!);
        return {
            private_key: jsonObject.private_key,
            client_email: jsonObject.client_email
        }
    }

    const storage = new Storage({
        projectId: "indriveapp-39520",
        // keyFilename: process.env.FIREBASE_CREDENTIAL_JSON,
        credentials: getGoogleCredentials(),
    });

    const bucket = storage.bucket("gs://indriveapp-39520.appspot.com/");
    return new Promise((resolve, reject) => {

        // console.log('delete path', deletePathImage)
        // if (deletePathImage) {

        //     if (deletePathImage != null || deletePathImage != undefined) {
        //         const parseDeletePathImage = url.parse(deletePathImage)
        //         var ulrDelete = parseDeletePathImage.pathname.slice(23);
        //         const fileDelete = bucket.file(`${ulrDelete}`)

        //         fileDelete.delete().then((imageDelete) => {

        //             console.log('se borro la imagen con exito')
        //         }).catch(err => {
        //             console.log('Failed to remove photo, error:', err)
        //         });

        //     }
        // }


        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {

                let fileUpload = bucket.file(`${pathImage}`);
                const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                });

                blobStream.on('error', (error) => {
                    console.log('Error al subir archivo a firebase', error);
                    reject('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', () => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    // const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${carpetaName}/${fileUpload.name}?alt=media&token=${uuid}`)
                    // console.log('URL DE CLOUD STORAGE ', url);
                    resolve(url);
                });
                blobStream.end(file.buffer);
            }
        }
    });
}

export default storageFile;