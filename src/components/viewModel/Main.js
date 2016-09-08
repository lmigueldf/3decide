import React from 'react';
import Constants from '../helpers/Constants';
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      demoText : 'This is a demo text example'
    };
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.redirect) {
      this.state.redirect = false;
      return <Edit projectData={this.state.projectData}/>;
    }
    return Constants.Helpers.carryScope(this, require('../views/main.rt'))();
  }
}

module.exports = AppComponent;
