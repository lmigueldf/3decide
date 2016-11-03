import React from 'react';
import Constants from '../helpers/Constants';
import Redirect from '../helpers/Redirect';
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
    /**
     * Validate UI values
     */
    setTimeout((()=>{
      // logged with success :P
      this.setState({
        redirect: true
      })
    }).bind(this), 5000);


    //Actions.login(user, password);
  }

  render() {
    if (this.state.redirect) {
      return <Redirect location="/main"/>;
    } else {
      return Constants.Helpers.carryScope(this, require('../views/login.rt'))();
    }
  }

}
module.exports = AppComponent;
