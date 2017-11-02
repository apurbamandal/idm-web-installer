import {Injectable} from '@angular/core';
import {VariableService} from "../util_variable/variable.service";

@Injectable()
export class ListService {

  constructor(private vutils: VariableService) {
  }

  isListEmpty(list) {
    if (this.vutils.isUndefinedOrNull(list)) {
      return true;
    } else {
      return list.length == 0;
    }
  }

  exceedsLength(list, length) {
    if (this.isListEmpty(list)) {
      return false;
    } else {
      return list.length > length;
    }
  }


}
