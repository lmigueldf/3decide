const React = require('react');
//const Router = require('react-router-component');
//const Link = Router.Link;
class NotFound extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1><span>404</span> NOT FOUND</h1>
                    <p><i>The requested resource page is not available!</i></p>
                </div>
            </div>
        );
    }
}

module.exports = NotFound;
