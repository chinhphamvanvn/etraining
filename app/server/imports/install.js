import {Settings,Langs} from '/app/lib/collections'; 

export function installSetting() {
	let settings = JSON.parse(Assets.getText('data/setting.json'));
    if (Settings.find().count() === 0) {
        settings.forEach((setting) => Settings.insert(setting));
    }
}


export function installLanguage() {
	let langs = JSON.parse(Assets.getText('data/lang.json'));
    if (Langs.find().count() === 0) {
        langs.forEach((lang) => Langs.insert(lang));
    }
}