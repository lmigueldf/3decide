import React from 'react';
import Constants from '../helpers/Constants';
import Actions from '../flux/actions/ActionCreators';
import AppStore from '../flux/stores/AppStore';
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Portal Desenvolvimento Engenharia',
      username: '',
      password: '',
      rememberMe: false
    };
  }

  componentDidMount() {}

  componentWillMount() {}

  componentWillUnmount() {
  }

  login(){
    let user = this.refs.username.input.value;
    let password = this.refs.password.input.value;
    /**
     * Validate UI values
     */
    if(user === ''){}


    //Actions.login(user, password);
  }

  render() {
    return Constants.Helpers.carryScope(this, require('../views/login.rt'))();
  }
}
module.exports = AppComponent;
