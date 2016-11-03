const React = require('react');
const Router = require('react-router-component');
export default React.createClass({
    displayName: 'Redirect',
    mixins: [Router.NavigatableMixin],
    propTypes: {
        force: React.PropTypes.bool,
        location: React.PropTypes.string
    },
    performRedirect (props) {
        this.navigate(props.location, {replace: false});
    },
    startRedirect(p) {
        clearTimeout(this.pendingRedirect);
        this.pendingRedirect = setTimeout(()=> this.performRedirect(p), 0);
    },
    componentDidMount () {
        this.startRedirect(this.props);
    },
    componentWillReceiveProps (props) {
        this.startRedirect(props);
    },
    render () {
        return (<div>Loading...</div>);
    }
});
