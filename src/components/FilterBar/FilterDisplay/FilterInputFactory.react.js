import { TextInput } from "./Inputs/TextInput.react";
import { DateInput } from "./Inputs/DateInput.react";
import { RelativeDateInput } from "./Inputs/RelativeDateInput.react";
import { CountInDateRangeInput } from "./Inputs/CountInDateRangeInput.react";
import { DateTimeInput } from "./Inputs/DateTimeInput.react";
import { SingleDateTimeInput } from "./Inputs/SingleDateTimeInput.react";
import { SelectInput } from "./Inputs/SelectInput.react";
import { LazySelectInput } from "./Inputs/LazySelectInput.react";
import { RangeInput } from "./Inputs/RangeInput.react";
import { MultiSelectInput } from "./Inputs/MultiSelectInput.react";
import { LazyMultiSelectInput } from "./Inputs/LazyMultiSelectInput.react";

export function FilterInputFactory(propObject) {
  // Janky way to ensure uniqueness of the input, so that it re-renders the
  // value in the input rather than just diffing based on input type.

  var inputs = {
    text: React.createElement(TextInput, propObject),
    id: React.createElement(TextInput, propObject),
    date: React.createElement(DateInput, propObject),
    date_relative: React.createElement(RelativeDateInput, propObject),
    count_in_date_range: React.createElement(CountInDateRangeInput, propObject),
    date_time: React.createElement(DateTimeInput, propObject),
    single_datetime: React.createElement(SingleDateTimeInput, propObject),
    select: React.createElement(SelectInput, propObject),
    lazy_select: React.createElement(LazySelectInput, propObject),
    range: React.createElement(RangeInput, propObject),
    multi_select: React.createElement(MultiSelectInput, propObject),
    lazy_multi_select: React.createElement(LazyMultiSelectInput, propObject),
  };

  if (inputs.hasOwnProperty(propObject.type)) {
    return inputs[propObject.type];
  }
}
