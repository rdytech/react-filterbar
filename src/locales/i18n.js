import * as defaultTranslations from "./en/translations.json";
import * as I18nJs from "i18n-js";

function t(key){
  if (typeof I18n !== 'undefined'){ return I18n.t(key); }
  I18nJs.translations["en"] = defaultTranslations["en"];
  return I18nJs.t(key);
}

export default t;
