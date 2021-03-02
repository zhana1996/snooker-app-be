import { extname } from 'path';

export const fileFilter = (req, file, callback) => {
  console.log(file);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return callback(new Error('Only image and pdf files are allowed!'), false);
    }
    callback(null, true);
  };
  
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};