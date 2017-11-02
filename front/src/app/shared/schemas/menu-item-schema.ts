import {Menu} from "./menu-schema";

export class MenuItem {
  menuName: string;
  mapName: string;
  context: string;
  subMenuList: MenuItem[];

}
