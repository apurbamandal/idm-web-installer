export class UIConstants {

  static get pageSizes(): any {
    return this._pageSizes;
  }

  static get rolesPageSizeAttribute(): any {
    return this._rolesPageSizeAttribute;
  }

  static get resourcesPageSizeAttribute(): any {
    return this._resourcesPageSizeAttribute;
  }

  private static _pageSizes: any = [10, 20, 50, 100, 500];
  private static _rolesPageSizeAttribute: String = 'rolesPageSize';
  private static _resourcesPageSizeAttribute: String = 'resourcesPageSize';

}
