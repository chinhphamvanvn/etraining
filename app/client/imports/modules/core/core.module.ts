import { ModuleWithProviders, NgModule,
  Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreRoutingModule } from './core.routing.module';
import { SharedModule } from '/client/imports/shared/shared.module';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/home/header.component';
import { BodyComponent } from './components/home/body.component';
import { FooterComponent } from './components/home/footer.component';
import { LoginComponent } from './components/auth/login.component';
import { SettingService } from '/client/imports/services';

@NgModule({
    // Components, Pipes, Directive
    declarations: [
        HomeComponent,
        HeaderComponent,
        BodyComponent,
        FooterComponent,
        LoginComponent
    ],
    // Providers
    providers: [SettingService
    ],
    // Modules
    imports: [
        BrowserModule,
        SharedModule,
        CoreRoutingModule,
        AccountsModule
    ],
    // Main Component
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
