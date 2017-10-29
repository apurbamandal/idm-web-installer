import {Injectable} from '@angular/core';

function _document(): any {
  // return the global native browser document object
  return document;
}

@Injectable()
export class DocumentRefService {

  constructor() {
  }

  get nativeDocument(): any {
    return _document();
  }

}
