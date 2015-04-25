import {TextInput} from "./Inputs/TextInput.react";
import {DateInput} from "./Inputs/DateInput.react";
import {SelectInput} from "./Inputs/SelectInput.react";

export function FilterInputFactory(type, value, uid, key) {
  // Janky way to ensure uniqueness of the input, so that it re-renders the
  // value in the input rather than just diffing based on input type.

  key = Date.now();

  if (type === "text" || type === "id") {
    return (
      <TextInput
        filterUid={uid}
        key={key}
        value={value}
      />
    );
  } else if (type === "date") {
    return (
      <DateInput
        filterUid={uid}
        key={key}
        value={value}
      />
    );
  } else if (type === "select") {
    return (
      <SelectInput
        filterUid={uid}
        key={key}
        value={value}
      />
    );
  } else {
    console.error("Not implemented yet!");
  }
}
