import type { ModelOwner, SOwner, signInParams } from "../contract/index";
import type { CRole } from "../../auth/contract/index";
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

  public async signIn(credentials: signInParams): Promise<any> {
    return this.model.signIn(credentials);
  }
}
