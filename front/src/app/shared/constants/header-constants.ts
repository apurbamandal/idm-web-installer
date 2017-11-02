export class HeaderConstants {
  static get contentType(): string {
    return this._contentType;
  }

  static set contentType(value: string) {
    this._contentType = value;
  }

  static get applicationJson(): string {
    return this._applicationJson;
  }

  static set applicationJson(value: string) {
    this._applicationJson = value;
  }

  static get authorization(): string {
    return this._authorization;
  }

  static set authorization(value: string) {
    this._authorization = value;
  }

  static get headerName(): string {
    return this._headerName;
  }

  static set headerName(value: string) {
    this._headerName = value;
  }

  static get zero(): string {
    return this._zero;
  }

  static set zero(value: string) {
    this._zero = value;
  }

  static get noCache(): string {
    return this._noCache;
  }

  static set noCache(value: string) {
    this._noCache = value;
  }

  static get noCacheNoStoreMustRevalidate(): string {
    return this._noCacheNoStoreMustRevalidate;
  }

  static set noCacheNoStoreMustRevalidate(value: string) {
    this._noCacheNoStoreMustRevalidate = value;
  }

  static get expires(): string {
    return this._expires;
  }

  static set expires(value: string) {
    this._expires = value;
  }

  static get pragma(): string {
    return this._pragma;
  }

  static set pragma(value: string) {
    this._pragma = value;
  }

  static get refresh(): string {
    return this._refresh;
  }

  static set refresh(value: string) {
    this._refresh = value;
  }

  static get daySeconds(): string {
    return this._daySeconds;
  }

  static set daySeconds(value: string) {
    this._daySeconds = value;
  }

  static get cacheControl(): string {
    return this._cacheControl;
  }

  static set cacheControl(value: string) {
    this._cacheControl = value;
  }

  private static _headerName: string = "netiq_idm_rbpm_acsrf";
  private static _zero: string = "0";
  private static _noCache: string = "no-cache";
  private static _noCacheNoStoreMustRevalidate: string = "no-cache, no-store, must-revalidate";
  private static _expires: string = "expires";
  private static _pragma: string = "pragma";
  private static _refresh: string = "refresh";
  private static _daySeconds: string = "86400";
  private static _cacheControl: string = "Cache-Control";
  private static _authorization: string = "Authorization";
  private static _contentType: string = 'Content-Type';
  private static _applicationJson: string = 'application/json';

}
