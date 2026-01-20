import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { NgSelectModule } from '@ng-select/ng-select';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
