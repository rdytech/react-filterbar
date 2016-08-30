import * as KeyPressHelper from "../../../../helpers/KeyPressHelper";

export class SelectInputBase extends React.Component {
  constructor(props) {
    super(props);
  }

  onKeyPress(event) {
    KeyPressHelper.applyFiltersOnEnterAfterSelect(event, this);
  }
}
