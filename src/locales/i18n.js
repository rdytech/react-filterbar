import * as defaultTranslations from "./en/translations.json";
import * as I18nJs from "i18n-js";

I18nJs.translations["en"] = defaultTranslations["en"];

function t(...args){
  if (typeof I18n !== 'undefined'){ return I18n.t(...args); }
  return I18nJs.t(...args);
}

export default t;
