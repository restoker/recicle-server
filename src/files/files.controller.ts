import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return await this.filesService.uploadFile(file);
    }
}
