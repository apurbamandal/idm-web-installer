import {ClientSettings} from "./client-settings-schema";

export class Client {
  id: string;
  config: ClientSettings;
  name: string;
  matchCondition: string;
  isDefault: boolean;
}
