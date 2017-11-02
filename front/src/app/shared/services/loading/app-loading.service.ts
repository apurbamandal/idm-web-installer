import {Injectable} from '@angular/core';

@Injectable()
export class AppLoadingService {
  get appLoading(): boolean {
    return this._appLoading;
  }

  set appLoading(value: boolean) {
    this._appLoading = value;
  }

  get TableDataLoading(): boolean {
    return this._TableDataLoading;
  }

  set TableDataLoading(value: boolean) {
    this._TableDataLoading = value;
  }

  private _appLoading: boolean = true;
  private _TableDataLoading: boolean = false;

  constructor() {
  }

}
