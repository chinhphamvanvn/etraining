import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '/client/imports/modules/core/core.module';
import { SharedModule } from '/client/imports/shared/shared.module';

@NgModule({
    // Components, Pipes, Directive
    declarations: [
        AppComponent
    ],
    // Providers
    providers: [
    ],
    // Modules
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SharedModule

    ],
    // Main Component
    bootstrap: [AppComponent]
})
export class AppModule { }
