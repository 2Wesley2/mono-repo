import type { ModelOwner } from "../contract/index";
import type { CRole } from "../../auth/contract/index";
import type { SOwner } from "#schema";
import type { SignInBody as SignInParams } from "#http";
import type { SignInPromise, NewDocumentPromise } from "#type-mongoose-wrapper";

export default class OwnerRepository {
  constructor(
    protected model: ModelOwner,
    protected roleRepository: CRole,
  ) {}

  public async signUp(data: SOwner): NewDocumentPromise<SOwner> {
    const owner = await this.model.signUp(data);
    await this.roleRepository.setRoleOwner(owner._id);
    return owner;
  }

  public async signIn(email: SignInParams["email"]): SignInPromise<SOwner> {
    return this.model.signIn(email);
  }
}
