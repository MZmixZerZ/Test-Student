import { SearchParameter } from "app/core/base/parameters/searchParameter.entity";
import { Role } from "../enum/role.enum";


export class GetAdminUserParameter extends SearchParameter {
  public isActive?: boolean;
  public roles?: Role[];
  constructor() {
    super();
  }
}
