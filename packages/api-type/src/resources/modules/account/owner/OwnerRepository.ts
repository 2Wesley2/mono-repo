import type { ModelOwner } from "../contract/index";
import type { CRole } from "../../auth/contract/index";
import type { SOwner } from "#schema";
import type { SignInBody as SignInParams } from "#http";
export default class OwnerRepository {
  constructor(
    protected model: ModelOwner,
    protected roleRepository: CRole,
  ) {}

  public async signUp(data: SOwner): Promise<any> {
    const owner = await this.model.signUp(data);
    await this.roleRepository.setRoleOwner(owner._id);
    return owner;
  }

  public async signIn(credentials: SignInParams): Promise<any> {
    return this.model.signIn(credentials);
  }
}
