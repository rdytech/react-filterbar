import {BatchActionsListItem} from "./BatchActionsListItem.react";
import * as ModalHelper from "../../../helpers/ModalHelper";

export class BatchActionsList extends React.Component {
  constructor(props) {
    super(props);
  }

  updateBatchFormFields(event) {
    event.preventDefault();
    if (this.context.tableStore.getSelectedRows().length > 0) {
      $.ajax({
        url: event.target.href,
        type: "POST",
        data: { 'batch_ids': this.context.tableStore.getSelectedRows() },
        dataType: "html",
        success: function(data) {
          ModalHelper.displayModalForData(data);
        }.bind(this)
      });
    }
    else {
      alert('No rows selected. Please select rows before running batch actions.');
    }
  }

  batchActionsListItems(batchActions) {
    return(
      Object.keys(batchActions).map(function(batchActionName, index) {
        return (
          <BatchActionsListItem
            key={index}
            label={batchActions[batchActionName].label}
            url={batchActions[batchActionName].url}
            onClickAction={this.updateBatchFormFields.bind(this)}
          />
        );
      }, this)
    );
  }

  render() {
    let buttonClass = "btn btn-default dropdown-toggle";
    let batchActions = this.context.batchActionsStore.getActions();

    if (batchActions.length === 0) {
      buttonClass += " disabled";
    }

    let batchActionItems = this.batchActionsListItems(batchActions);

    return(
      <div className="btn-group">
        <button
          aria-expanded="false"
          aria-haspopup="true"
          className={buttonClass}
          data-toggle="dropdown"
          type="button"
        >
          Batch Actions
          <i className="icon icon-chevron-down" />
        </button>
        <ul className="dropdown-menu" role="menu">
          {batchActionItems}
        </ul>
      </div>
    );
  }
}

BatchActionsList.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired,
  tableStore: React.PropTypes.object.isRequired,
  batchActionsStore: React.PropTypes.object.isRequired
};
