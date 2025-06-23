import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environment/environment';


if (environment.production) {
  enableProdMode();
}


export const bootstrapServer = () => {
  return bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers,
      provideServerRendering()
    ]
  }).catch(err => console.error(err));
};


export default bootstrapServer;
