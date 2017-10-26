import { Injectable } from '@angular/core';

@Injectable()
export class VariableService {

  constructor() { }

  isUndefined(x) {
    return x == undefined;
  }

  isNull(x) {
    return x == null;
  }

  isUndefinedOrNull(x) {
    return this.isUndefined(x) || this.isNull(x);
  }

  isEmptyString(x) {
    if (this.isUndefinedOrNull(x)) {
      return true;
    }
    return x == "";
  }

  equals(x, y) {
    if (this.isUndefinedOrNull(x) || this.isUndefinedOrNull(y)) {
      return false;
    }
    return x == y;
  }

  isDefinedPositiveNumber(x) {
    if (this.isUndefinedOrNull(x)) return false;
    return typeof (x) == "number" && x > -1;
  }

  isEmptyArray(x) {
    if (this.isUndefinedOrNull(x)) {
      return true;
    } else {
      return x.length === 0;
    }
  }

  isArray(x) {
    if (!this.isUndefined(x) && !this.isNull(x)
      && !this.isUndefined(x.constructor) && x.constructor == Array) {
      return true;
    } else {
      return false;
    }
  }

  isBoolean(x) {
    if (!this.isUndefined(x) && !this.isNull(x)
      && !this.isUndefined(x.constructor) && x.constructor == Boolean) {
      return true;
    } else {
      return false;
    }
  }

  getCnFromDn(dn) {
    if (dn != undefined && dn != null) {
      dn = /[^,]*/.exec(dn)[0];
      dn = dn.replace(/cn=/gi, "");
    }
    return dn;
  };
}
