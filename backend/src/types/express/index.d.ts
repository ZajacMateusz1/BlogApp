import "express";
interface UserDataInterface {
  userId: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      userData?: UserDataInterface;
    }
  }
}
