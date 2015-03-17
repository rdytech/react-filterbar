import {TextInput} from "./Inputs/TextInput.react";
import {DateInput} from "./Inputs/DateInput.react";
import {SelectInput} from "./Inputs/SelectInput.react";

export function FilterInputFactory(type, value, uid, key) {
  // Janky way to ensure uniqueness of the input, so that it re-renders the
  // value in the input rather than just diffing based on input type.
  key = Date.now();

  var propObject = {filterUid: uid, key: key, value: value};

  var inputs = {
    text: React.createElement(TextInput, propObject),
    id: React.createElement(TextInput, propObject),
    date: React.createElement(DateInput, propObject),
    select: React.createElement(SelectInput, propObject)
  };

  if (inputs.hasOwnProperty(type)) {
    return inputs[type];
  }
}
