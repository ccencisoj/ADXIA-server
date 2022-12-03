import path from 'path';
import multer from 'multer';
import { NextFunction, Request, Response } from 'express';

const dest = path.resolve("./uploads/tempImages");

const uploadMiddleware = multer({dest}).single("image");

export class UploadImageMiddleware {
  public execute = (req: Request, res: Response, next: NextFunction)=> {
    uploadMiddleware(req, res, next);
  }
}
