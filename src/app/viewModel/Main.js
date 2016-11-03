import React from 'react';
import Constants from '../helpers/Constants';
import Actions from '../flux/actions/ActionCreators';
import AppStore from '../flux/stores/AppStore';
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType : 'lines'
    };
  }

  componentDidMount() {
  }

  componentWillMount() {
    let topologyID = 432342;
    AppStore.addEventListener('loadingEvent', this.onLoadingEvent.bind(this));
    AppStore.addEventListener('onTopologyLoaded', this.onTopologyLoaded.bind(this));
    Actions.getTopology(topologyID);
  }

  componentWillUnmount() {
  }

  onLoadingEvent(loading) {
    this.setState({isLoading: loading});
  }

  onTopologyLoaded() {
    // Handle topology data to build the topology graphic view
  }

  render() {
    return Constants.Helpers.carryScope(this, require('../views/main.rt'))();
  }
}

module.exports = AppComponent;
