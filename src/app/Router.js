const React = require('react'),
  Router = require('react-router-component'),
  Locations = Router.Locations,
  Location = Router.Location,
  NotFound = Router.NotFound;
const Main = require('./viewModel/Main');
const NotFoundPage = require('./404');

require('styles/main.scss');
module.exports = React.createClass({
  render(){
    return (
      <Locations>
        <Location path={'/'} handler={Main}/>
        <NotFound handler={NotFoundPage}/>
      </Locations>);
  }
});
