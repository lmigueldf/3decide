const React = require('react'),
  Router = require('react-router-component'),
  Locations = Router.Locations,
  Location = Router.Location,
  NotFound = Router.NotFound;
const Login = require('./viewModel/Login');
const Main = require('./viewModel/Main');
const D3Chart = require('./components/D3Chart');
const NotFoundPage = require('./404');

require('styles/main.scss');
module.exports = React.createClass({
  render(){
    return (
      <Locations >
        <Location path={'/'} handler={Login}/>
        <Location path={'/main'} handler={Main}/>
        <Location path={'/d3'} handler={D3Chart}/>
        <NotFound handler={NotFoundPage}/>
      </Locations>);
  }
});
