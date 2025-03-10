import UserModel from "./account/user/UserModel";
import UserService from "./account/user/UserService";
import UserController from "./account/user/UserController";

const userModel = new UserModel();
const userService = new UserService(userModel);
const userController = new UserController(userService);

export const controllers = {
  user: userController,
} as const;
