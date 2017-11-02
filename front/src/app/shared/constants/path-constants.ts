export class PathConstats {

  static get navigationRightsApi(): string {
    return this._navigationRightsApi;
  }

  static get settingsApi(): string {
    return this._settingsApi;
  }

  static get userRightsApi(): string {
    return this._userRightsApi;
  }

  static get loggedInUserDetailsApi(): string {
    return this._loggedInUserDetailsApi;
  }

  static get defaultRBPMContext(): string {
    return this._defaultRBPMContext;
  }

  static get restAccess(): string {
    return this._restAccess;
  }

  static get restCatalog(): string {
    return this._restCatalog;
  }

  static get usersListApi(): string {
    return this._usersListApi;
  }

  static get taskColumnCustomizationApi(): string {
    return this._taskColumnCustomizationApi;
  }

  static get columnCustomizationApi(): string {
    return this._columnCustomizationApi;
  }

  static get columnCustomizationresourcesApi(): string {
    return this._columnCustomizationresourcesApi;
  }

  static get taskListApi(): string {
    return this._taskListApi;
  }

  static get groupsListApi(): string {
    return this._groupsListApi;
  }

  static get rolesListApi(): string {
    return this._rolesListApi;
  }

  static get rolesList(): string {
    return this._rolesList;
  }

  static get resourcesList(): string {
    return this._resourcesList;
  }

  static get userColumnPreferenceApi(): string {
    return this._userColumnPreferenceApi;
  }

  static get roleCategoriesApi(): string {
    return this._roleCategoriesApi;
  }

  static get resourceCategoriesApi(): string {
    return this._resourceCategoriesApi;
  }

  static get roleContainersApi(): string {
    return this._roleContainersApi;
  }

  static get prdsApi(): string {
    return this._prdsApi;
  }

  static get driversApi(): string {
    return this._driversApi;
  }

  static get driverEntitlementsApi(): string {
    return this._driverEntitlementsApi;
  }

  static get roleDetailsApi(): string {
    return this._roleDetailsApi;
  }

  static get resourcesDetailsApi(): string {
    return this._resourcesDetailsApi;
  }

  static get sysNrfRoles(): string {
    return this._sysNrfRoles;
  }

  static get sysNrfResources(): string {
    return this._sysNrfResources;
  }

  static get deleteRoles(): string {
    return this._deleteRoles;
  }

  static get deleteResources(): string {
    return this._deleteResources;
  }

  static get roleCreateApi(): string {
    return this._roleCreateAPI;
  }

  static get getResourceEntitlementList(): string {
    return this._getResourceEntitlementList;
  }

  static get supportedLocalesApi(): string {
    return this._supportedLocales;
  }

  static get userLocaleApi(): string {
    return this._userLocale;
  }

  static get defaultLocaleApi(): string {
    return this._defaultLocale;
  }

  private static readonly _restAccess = '/rest/access';
  private static readonly _restCatalog = '/rest/catalog';
  private static readonly _defaultRBPMContext = 'idmtools';
  private static readonly _loggedInUserDetailsApi = PathConstats._restAccess + '/users/userDefaults';
  private static readonly _navigationRightsApi = PathConstats._restAccess + '/info/user/navigationmenu';
  private static readonly _settingsApi = PathConstats._restAccess + '/config/clients/';
  private static readonly _userRightsApi = PathConstats._restAccess + '/info/user/rights';
  private static readonly _usersListApi = PathConstats._restAccess + '/users/list';
  private static readonly _groupsListApi = PathConstats._restCatalog + '/groups';
  private static readonly _rolesListApi = PathConstats._restCatalog + '/roles';
  private static readonly _rolesList = PathConstats._restCatalog + '/roles/list';
  private static readonly _roleCategoriesApi = PathConstats._restCatalog + '/roleCategories';
  private static readonly _resourceCategoriesApi = PathConstats._restCatalog + '/resourceCategories';
  private static readonly _roleContainersApi = PathConstats._restCatalog + '/containers/container';
  private static readonly _prdsApi = PathConstats._restCatalog + '/prds';
  private static readonly _driversApi = PathConstats._restCatalog + '/drivers';
  private static readonly _driverEntitlementsApi = PathConstats._restCatalog + '/drivers/driver';
  private static readonly _taskColumnCustomizationApi = '/preference?attribute=com.novell.idm.dashboard.tasklist-columns.preference';
  private static readonly _columnCustomizationApi = '/preference?attribute=com.novell.idm.admin.roleList-columns.preference';
  private static readonly _columnCustomizationresourcesApi = '/preference?attribute=com.novell.idm.admin.resourceList-columns.preference';
  private static readonly _taskListApi = '/tasks/list';
  private static readonly _userColumnPreferenceApi = '/preference';
  private static readonly _resourcesList = PathConstats._restCatalog + '/resources/list';
  private static readonly _roleDetailsApi = PathConstats._restCatalog + '/roles/role';
  private static readonly _resourcesDetailsApi = PathConstats._restCatalog + '/resources/resource';
  private static readonly _sysNrfRoles = PathConstats._restAccess + '/entities/schema/rra?entityName=sys-nrf-role ';
  private static readonly _sysNrfResources = PathConstats._restAccess + '/entities/schema/rra?entityName=sys-nrf-resource ';
  private static readonly _roleCreateAPI = PathConstats._restCatalog + '/roles';
  private static readonly _deleteRoles = PathConstats._restCatalog + '/roles/role';
  private static readonly _deleteResources = PathConstats._restCatalog + '/resources/resource';
  private static readonly _supportedLocales = PathConstats._restCatalog + "/supportedlocales";
  private static readonly _userLocale = PathConstats._restCatalog + "/supportedlocales/userlocale";
  private static readonly _defaultLocale = PathConstats._restCatalog + "/supportedlocales/defaultlocale";
  private static readonly _getResourceEntitlementList = PathConstats._restCatalog + '/resources/resource/entitlements/list';
}
