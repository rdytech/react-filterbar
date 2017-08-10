import {QuickFilters} from "../QuickFilters/QuickFilters.react";

export class TableCaption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content = this.props.value;
    if(this.props.outputDiv) {
      if(content) {
        return (
          <div className='clearfix' style={{marginBottom: `5px`}}>
            <div className='pull-left'>
                {content}
              </div>
              <div className='pull-right'>
                <QuickFilters />
              </div>
          </div>
        );
      }
      else {
        return (
          <div></div>
        );
      }
    }
    else {
      if (content) {
        return (
          <caption>
            <div className='pull-left'>
              {content}
            </div>
            <div className='pull-right'>
              <QuickFilters />
            </div>
          </caption>
        );
      }
      else {
        return (
          <caption hidden />
        );
      }
    }
  }
}
