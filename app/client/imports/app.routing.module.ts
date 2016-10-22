import { RouterModule }   from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'admin', loadChildren: 'modules/admin/admin.module#AdminModule' },
            { path: 'cms', loadChildren: 'modules/cms/cms.module#CmsModule' },
            { path: 'lms', loadChildren: 'modules/lms/lms.module#LmsModule' }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}