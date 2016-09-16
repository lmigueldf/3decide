const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const CommLayer = require('../../helpers/CommLayer');
// App Store
const AppStore = assign({}, EventEmitter.prototype, {
  /**
   *
   * @param event
   */
  emitEvent: function (event, params) {
    this.emit(event, params);
  },
  /**
   * @param {function} callback
   */
  addEventListener: function (event, callback) {
    this.on(event, callback);
  },
  /**
   * @param {function} callback
   */
  removeEventListener: function (event, callback) {
    this.removeListener(event, callback);
  }
});
//----------------------------------------------------------------------------------------------------------------------
AppStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.type) {
    case 'topology/get':
      AppStore.emitEvent('loadingEvent', true);
      // Request to server
      CommLayer.Topologies.load((err, data)=> {
        if(err != void 0){
          // Handle Error!!!
        }else{
          AppStore.emitEvent('onTopologyLoaded', data || action.params);
        }
        AppStore.emitEvent('loadingEvent', false);
      }, 5000);
      break;
    default:
  }
});
module.exports = AppStore;
