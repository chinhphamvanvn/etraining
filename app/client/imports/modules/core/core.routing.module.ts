import { RouterModule }   from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild([
            { path: 'home', component: HomeComponent }
        ])
    ],
    exports: [
        RouterModule,
    ]
})
export class CoreRoutingModule {
}