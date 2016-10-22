import { Injectable }    from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Setting } from '/lib/models';
import { SettingStream } from '/lib/collections';


@Injectable()
export class SettingService {
	constructor() {
    }
    
    getSiteTitle():Observable<string> {
       return SettingStream.find({'key':'site-title'}).map(setting => setting[0].value);
    }


}