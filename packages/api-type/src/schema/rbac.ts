import { Types } from "mongoose";

export interface SPermission {
  _id?: string;
  name: string;
  description: string;
}

export interface SRole {
  owner_id: Types.ObjectId;
  name: string;
  permissions: SPermission[];
}
