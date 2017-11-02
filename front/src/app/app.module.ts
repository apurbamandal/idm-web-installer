import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import {NgModule, ApplicationRef, APP_INITIALIZER, Injector} from '@angular/core';
import {RouterModule, PreloadAllModules} from '@angular/router';

// Angular 2 Moment : Used for dates and time

import {MomentModule} from 'angular2-moment';

// Hot Module Replacement, used for loading files quickly in webpack-dev-serve

import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';

// Ng2 Dragula : Used for Drag and Drop

import {DragulaModule, DragulaService} from 'ng2-dragula/ng2-dragula';

// Angular Material used for quorum slider widget

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import '../styles/styles.scss';
import {AppContextService} from "./shared/services/context/app-context.service";
import {AppAuthenticationService} from "./shared/services/authentication/app-authentication.service";
import {LoggedInUserDetailsService} from "./shared/services/loggedin-user-details/logged-in-user-details.service";
import {WindowRefService} from "./shared/services/utilities/util_winRef/window-ref.service";
import {DocumentRefService} from "./shared/services/utilities/util_docRef/document-ref.service";
import {CookiesService} from "./shared/services/utilities/util_cookies/cookies.service";
import {ValidationService} from "./shared/services/utilities/util_validation/validation.service";
import {LocaleService} from "./shared/services/locale/locale.service";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {httpFactory} from "./shared/factories/http.factory";
import {DefaultRequestOptionsService} from "./shared/services/utilities/util_default-request-options/default-request-options.service";
import {LoadingComponent} from './loading/loading.component';
import {AppLoadingService} from "./shared/services/loading/app-loading.service";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {LogoutService} from "./shared/services/logout/logout.service";
import {Table} from "./widgets/table/table";
import {EmitterService} from "./shared/services/emitter/emitter.service";
import {PaginationComponent} from './widgets/pagination/pagination.component';
import {DemoComponent} from './demo/demo.component';
import {ListService} from "./shared/services/utilities/util_list/list.service";
import {VariableService} from "./shared/services/utilities/util_variable/variable.service";
import {UiDisplayComponent} from './widgets/ui-display/ui-display.component';
import {UnauthorizeComponent} from './unauthorize/unauthorize.component';
import {FeedBackComponent} from "./widgets/feed-back/feed-back.component";
import {FeedBackService} from "./shared/services/feed-back/feed-back.service";
import {ConfirmationWidgetComponent} from './widgets/confirmation-widget/confirmation-widget.component';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {LoginComponent} from './login/login.component';
import {InstallComponent} from "./install/install.component";


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

export function loadContext(appContext: AppContextService) {
  return () => appContext.load();
}

//Localization path
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  // HOw to implement Translation
  //<div>{{ 'HELLO' | translate:param }}</div>
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoadingComponent,
    Table,
    PaginationComponent,
    DemoComponent,
    UiDisplayComponent,
    UnauthorizeComponent,
    FeedBackComponent,
    ConfirmationWidgetComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    InstallComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    DragulaModule,
    FormsModule,
    ReactiveFormsModule
  ],

  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    AppContextService,
    AppAuthenticationService,
    LoggedInUserDetailsService,
    WindowRefService,
    DocumentRefService,
    CookiesService,
    ValidationService,
    LocaleService,
    AppLoadingService,
    LogoutService,
    EmitterService,
    VariableService,
    ListService,
    FeedBackService,
    Table,
    {
      provide: APP_INITIALIZER,
      useFactory: loadContext,
      deps: [AppContextService],
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, Injector, CookiesService]
    },
    {
      provide: RequestOptions,
      useClass: DefaultRequestOptionsService
    },
    DragulaService
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
