var AppDispatcher = require('../dispatcher/AppDispatcher');
var Action = {
  getTopology(id) {
    AppDispatcher.dispatch({
      type: 'topology/get',
      params: {id}
    });
  }
};
module.exports = Action;

