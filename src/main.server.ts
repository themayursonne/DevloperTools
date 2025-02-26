import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (enableProdMode) {
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

// Add a default export to match the expected export in the build configuration
export default bootstrapServer;