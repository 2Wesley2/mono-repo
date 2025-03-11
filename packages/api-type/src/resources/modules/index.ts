import OwnerModel from "./account/owner/OwnerModel";
import OwnerService from "./account/owner/OwnerService";
import OwnerController from "./account/owner/OwnerController";

const ownerModel = new OwnerModel();
const ownerService = new OwnerService(ownerModel);
const ownerController = new OwnerController(ownerService);

export const controllers = {
  ownerUser: ownerController,
} as const;
