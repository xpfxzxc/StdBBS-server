import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async write(
    folderPath: string,
    fileName: string,
    buffer: Buffer | String,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(folderPath, { recursive: true, mode: 0o6 }, err => {
        if (err) {
          reject(err);
        }
        fs.writeFile(`${folderPath}/${fileName}`, buffer, err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }

  async delete(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}
