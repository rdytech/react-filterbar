import * as KeyPressHelper from "../../../../helpers/KeyPressHelper";

export class TextInputBase extends React.Component {
  constructor(props) {
    super(props);
  }

  onKeyPress(event) {
    KeyPressHelper.applyFiltersOnEnterAfterBlur(event, this);
  }
}
