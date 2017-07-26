import { platformBrowserDynamic  } from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';
import { AppComponent } from '../app/app.component';
// import { APP_ROUTER_PROVIDERS } from '../app/app.routes';
// import { HTTP_PROVIDERS } from '@angular/http';
import { AppModule } from '../app/app.module';

// if (process.env.ENV === 'production') {
//   enableProdMode();
// }
platformBrowserDynamic().bootstrapModule(AppModule);
// bootstrap(AppComponent, [ HTTP_PROVIDERS ,APP_ROUTER_PROVIDERS]);
