import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import { SettingService } from '/client/imports/services';




@Component({
    moduleId: module.id,
    selector: 'core-home',
    template:   `
                    <core-header></core-header>
                    <core-body></core-body>
                    <core-footer></core-footer>
                `,
    providers: [SettingService]
})
export class HomeComponent implements OnInit {
	
    constructor(private titleService: Title,private settingService:SettingService) {
    }
    
    ngOnInit() {
        let self = this;
        this.settingService.getSiteTitle().subscribe(title=> self.titleService.setTitle( title ));
      }
}
