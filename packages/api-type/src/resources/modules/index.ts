import UserModel from "./account/user/UserModel";
import UserController from "./account/user/UserController";

const userModel = new UserModel();
const userController = new UserController(userModel);

export const controllers = {
  user: userController,
} as const;
