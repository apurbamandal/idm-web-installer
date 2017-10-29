import {PathConstats} from "../constants/path-constants";

export class ServerContext {
  context: string = PathConstats.defaultRBPMContext;
  Authorize: string = "";
  Logout: string = "";
  RRAClientID: string = "";
  RRARedirectUrl: string = "";
  ProvisionRoot: string = "";
}
