var AppDispatcher = require('../dispatcher/AppDispatcher');
var Action = {
  login(username, password){
    AppDispatcher.dispatch({
      type: 'login/submit',
      params: {username , password}
    });
  },

  getTopology(id) {
    AppDispatcher.dispatch({
      type: 'topology/get',
      params: {id}
    });
  }
};
module.exports = Action;

