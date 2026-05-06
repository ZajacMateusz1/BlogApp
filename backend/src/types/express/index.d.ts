import "express";
interface UserDataInterface {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      userData?: UserDataInterface;
    }
  }
}
