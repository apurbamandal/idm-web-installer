# IAS Angular 4 BoilerPlate 

[![N|Solid](https://goo.gl/V1Yf2z)](https://nodesource.com/products/nsolid)

An Angular starter kit featuring [Angular4], [Ahead of Time Compile], [Router], [Forms], [Http], [Services], [Tests], [E2E], [Protractor], [Istanbul], [TypeScript], [@types], [TsLint] and [Webpack] 2 by IDM TEAM.

This seed repo serves as an Angular starter for anyone looking to get up and running with Angular and TypeScript fast. Using a Webpack 2 for building our files and assisting with boilerplate.

# Why IAS Angular 4 BoilerPlate?
When migrating from other frameworks  to angular4 a huge amount of  time is spent on setting up the project with minimal configuration needed for the application to run. we provide:
- Setting up a project with a single command .  
- Project contains a demo page with all the necessary componets/widgets along with the header and footer.
- All the components are as per IAS UX Guidelines.

It  helps you to focus on other important aspects of the product and when you are all set with the build. Otherwise alot of time is spent on developing all the frequent used components like dateRange-picker, table etc. This will make all the IAS widgets and tables look alike.

- BoilerPlate  provide a set of this comonents which can be reused .
- One step application Deploy
- Local server (run live in ur local system)
- Easy file structure for quick access and understanding.
##  Features:
  - Localization support with automatic string extracttion from .html and .ts files , reduces the development time.  
  - Authentication Using OSP  (keeping the the form values intact ). 
  - Pre added Components  like Header-Footer and can be cutomized based on user settings .
  - Reusable widgets like Dropdown, DateRange, confirmation, feedback, Table, Accordain (desiged as  IAS UX Guidelines).
  - SASS and icons as per IAS UX Guidelines , so look and feel remains same accross all the product. 
  - extended forms control validation for name, emails,arrays etc.
  - Demo of all the widgets used in the boiler-plate for quick implementation. 
  - Contextual help based on Pages/Routes and for complex forms or components which works best our documentation frameworks.

>"Reusability of components, objects, code, stuff, ...whatever...remains the most unfulfilled promise offered by any software methodology that has reared its pretty head since Von Neuman. " 
    \-Larry L. Johnson





  
# File Structure
We use the component approach in our starter. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks:
```sh
IDM-Angular4-BoilerPlate /
 ├──config/                        * our configuration
 |   ├──helpers.js                 * helper functions for our configuration files
 |   ├──spec-bundle.js             * ignore this magic that sets up our Angular testing environment
 |   ├──karma.conf.js              * karma config for our unit tests
 |   ├──extractStrings.js		   *  Extracts all the locale strings and saves its as key value pare in json file
 |   ├──protractor.conf.js         * protractor config for our end-to-end tests
 |   ├──protractor.conf.js         * protractor config for our end-to-end tests
 │   ├──webpack.dev.js             * our development webpack config
 │   ├──webpack.prod.js            * our production webpack config
 │   └──webpack.test.js            * our testing webpack config
 │
 ├──src/                           * our source files that will be compiled to javascript
 |   ├──main.browser.ts            * our entry file for our browser environment
 │   │
 |   ├──index.html                 * Index.html: where we generate our index page
 │   │
 |   ├──polyfills.ts               * our polyfills file
 │   │
 │   ├──app/                       * WebApp: folder
 │   │   ├──app.component.spec.ts  * a simple test of components in app.component.ts
 │   │   ├──app.e2e.ts             * a simple end-to-end test for /
 │   │   └──app.component.ts       * a simple version of our App component components
 │   │
 │   └──asassets/                    * static assets are served here
 │       ├──icon/                  * our list of icons 
 │       ├──fonts/				   * our list of font lists
 │       ├──i18n/				   * all the locale json goes here
 │       ├──images/				   * all the images goes here
 │       ├──help/				   * contextual help goes here
 │       ├──robots.txt             * for search engines to crawl your website
 │       └──humans.txt             * for humans to know who the developers are
 │
 │
 ├──tslint.json                    * typescript lint config
 ├──typedoc.json                   * typescript documentation generator
 ├──tsconfig.json                  * typescript config used outside webpack
 ├──tsconfig.webpack.json          * config that webpack uses for typescript
 ├──package.json                   * what npm uses to manage it's dependencies
 └──webpack.config.js              * webpack main configuration file`
 ```



**Lets make development Easy !**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Router]:<> 
   [Forms]:<>
   [Http]:<>
   [Services]:<>
   [Tests]:<>
   [E2E]:<>
   [Protractor]:<>
   [Istanbul]:<>
   [TypeScript]:<>
   [@types]:<>
   [TsLint]:<>
   [Webpack]:<http://webpack.github.io/>
   [Ahead of Time Compile]:<https://angular.io/docs/ts/latest/cookbook/aot-compiler.html>
   [Angular4]: <https://angular.io/>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
