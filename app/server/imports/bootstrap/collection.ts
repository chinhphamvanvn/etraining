
import { SettingStream } from '/lib/collections'
import { Setting } from '/lib/models';

export function initSetting() {
	let settings = JSON.parse(Assets.getText('data/setting.json'));
    if (SettingStream.find().cursor.count() === 0) {
        settings.forEach((setting) => SettingStream.insert(setting));
    }
}