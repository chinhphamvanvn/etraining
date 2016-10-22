import { NgModule }         from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }     from '@angular/common';
import { FormsModule, ReactiveFormsModule }      from '@angular/forms';
import {TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService} from "ng2-translate";
import { Http, HttpModule } from '@angular/http';
import { MdButtonModule } from "@angular2-material/button";
import { MdToolbarModule } from "@angular2-material/toolbar";
import { MdInputModule } from "@angular2-material/input";
import { MdCardModule } from "@angular2-material/card";
import { MdCoreModule } from "@angular2-material/core";
import { MdCheckboxModule } from "@angular2-material/checkbox";
import {MdListModule} from "@angular2-material/list";
import { DisplayNamePipe } from './pipes/display-name.pipe';

@NgModule({
    // Components, Pipes, Directive
    declarations: [
        DisplayNamePipe
    ],
    // Providers
    providers: [
        TranslateService
    ],
    // Modules
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        TranslateModule.forRoot({ 
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, '/i18n', '.json'),
          deps: [Http]
        }),
        HttpModule,
        MdCoreModule.forRoot(),
        MdButtonModule.forRoot(),
        MdToolbarModule.forRoot(),
        MdInputModule.forRoot(),
        MdCardModule.forRoot(),
        MdCheckboxModule.forRoot(),
        MdListModule.forRoot()

    ],
    exports:  [ ReactiveFormsModule, FormsModule,TranslateModule,CommonModule, HttpModule,
                MdCoreModule,MdButtonModule,MdToolbarModule,MdInputModule,MdCardModule,MdCheckboxModule,
                MdListModule,DisplayNamePipe]
})
export class SharedModule { }