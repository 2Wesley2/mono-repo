import type { ModelOwner, RepositoryOwner } from "#contract-account";
import type { RoleModel } from "#contract-auth";
import type { SOwner } from "#schema";
import type { SignInBody as SignInParams } from "#http";
import type { ToObjectDocument } from "#mongoose-wrapper/mongoose-types";

export default class OwnerRepository implements RepositoryOwner {
  constructor(
    protected model: ModelOwner,
    protected roleRepository: RoleModel,
  ) {}

  public async signUp(data: SOwner): Promise<ToObjectDocument<SOwner>> {
    const owner = await this.model.signUp(data);
    await this.roleRepository.setRoleOwner(owner._id);
    return owner;
  }

  public async signIn(
    credential: SignInParams["email"],
  ): Promise<ToObjectDocument<SOwner>> {
    return this.model.signIn(credential);
  }
}
