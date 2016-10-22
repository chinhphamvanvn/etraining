import { RouterModule }   from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild([
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CmsRoutingModule {
}