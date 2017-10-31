import {PathConstats} from "../constants/path-constants";

export class Context {
  context: string = PathConstats.defaultRBPMContext;
  authorize: string = "";
  logout: string = "";
  rraClientId: string = "";
  rraRedirectUrl: string = "";
  provisionRoot: string = "";
}
