const HTTP = {
  URL_SEPARATOR: '/',
  REQUEST: {
    METHOD: {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DELETE',
      UPDATE: 'UPDATE'
    }
  },
  RESPONSE: {
    STATUS: {
      NO_RESPONSE: {code: 0, message: 'No response'},
      OK: {code: 200, message: 'Ok'},
      NOT_MODIFIED: {code: 304, message: 'Not Modified'},
      UNAUTHORIZED: {code: 403, message: 'Unauthorized'},
      NOT_FOUND: {code: 404, message: 'Not Found'}
    }
  }
};
function curry(scope, fn) {
  // set the scope to window (the default global object) if no scope was passed in.
  scope = scope || window;
  // Convert arguments into a plain array, because it is sadly not one.
  // args will have all extra arguments in it, not including the first 2 (fn, scope)
  // The loop skips fn and scope by starting at the index 2 with i = 2
  var args = [];
  for (var i = 2, len = arguments.length; i < len; ++i) {
    args.push(arguments[i]);
  }
  // Create the new function to return
  return function () {
    // Convert any arguments passed to the this function into an array.
    // This time we want them all
    var args2 = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    // Here we combine any args originally passed to curry, with the args
    // passed directly to this function.
    //   curry(fn, scope, a, b)(c, d)
    // would set argstotal = [a, b, c, d]
    var argstotal = args.concat(args2);
    // execute the original function being curried in the context of "scope"
    // but with our combined array of arguments
    return fn.apply(scope, argstotal);
  };
}
let HttpRequest = function (opts) {
  this.service = opts.service;
  this.action = opts.action;
  this.url = opts.url || '/';
  this.formParams = [];
  this.headers = [];
  this.contentType = void 0;
  this.method = opts.method || HTTP.REQUEST.METHOD.POST;
  this.onResponse = function () {
    //log.warn('No \'onResponse\' method set for incoming responses');
  };
  this.onTimeout = function () {
    //log.warn('No \'onTimeout\' method set for incoming responses');
  };
};
HttpRequest.prototype.setFormParam = function (key, value) {
  this.formParams.push({propName: key, value: value});
  return this;
};
HttpRequest.prototype.setBody = function (body) {
  this.body = body;
  return this;
};
HttpRequest.prototype.setHeader = function (key, value) {
  var obj = {};
  obj[key] = value;
  this.headers.push(obj);
  return this;
};
HttpRequest.prototype.build = function (xhr) {
  /**
   * Standard CORS requests do not send or set any cookies by default.
   * In order to include cookies as part of the request,
   * you need to set the XMLHttpRequest’s .withCredentials property to true.
   * Access-Control-Allow-Credentials: true
   */
  xhr.withCredentials = false;
  xhr.overrideMimeType(this.contentType || 'application/json');
  //xhr.setRequestHeader('Content-Type', this.contentType || 'application/json');
  //xhr.responseType = this.contentType || 'application/json';
  if (this.headers.length > 0) {
    for (var i = 0; i < this.headers.length; i++) {
      var obj = this.headers[i];
      xhr.setRequestHeader(Object.keys(obj)[0], obj[Object.keys(obj)]);
    }
  }
  if (this.formParams.length > 0) {
    if (this.contentType === 'application/x-www-form-urlencoded') {
      var formString = '';
      for (var i = 0; i < this.formParams.length; i++) {
        var obj = this.formParams[i];
        formString += Object.keys(obj)[0] + '=' + obj[Object.keys(obj)]
        if (i < this.formParams.length - 1) {
          formString += '&';
        }
      }
      return formString;
    } else {
      var formData = new FormData();
      for (var index in this.formParams) {
        formData.append(this.formParams[index].propName,
          this.formParams[index].value);
      }
      return formData;
    }
  }
  return this.body;
};
let HttpResponse = function (opts) {
  this.status = opts.status || opts.code;
  this.body = opts.response !== void 0 ? JSON.parse(opts.response) : opts.message;
};
let CommLayer = function (config) {
  this.useHttp = config.useHttp || true;
  this.corsSupport = config.corsSupport || false;
};
const COMM_LAYER = {
  PROTOCOL: {
    HTTP: 'http'
  }
};
CommLayer.prototype.serverRequestFactory = function (opts) {
  var request;
  switch (opts.type) {
    case COMM_LAYER.PROTOCOL.HTTP:
      request = new HttpRequest(opts);
      break;
    default :
      request = new HttpRequest(opts);
      break;
  }
  return request;
};
CommLayer.prototype.sendRequest = function (request) {
  if (request instanceof HttpRequest) {
    this.sendHttpRequest(request);
  }
};
CommLayer.prototype.sendHttpRequest = function (request) {
  function createCORSRequest(method, url) {
    var xhrRequest = new XMLHttpRequest();
    if ('withCredentials' in xhrRequest) {
      // Check if the XMLHttpRequest object has a 'withCredentials' property.
      // 'withCredentials' only exists on XMLHTTPRequest2 objects.
      xhrRequest.open(method, url, true);

    } else if (typeof XDomainRequest !== 'undefined') {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhrRequest = new XDomainRequest();
      xhrRequest.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhrRequest = null;
    }
    return xhrRequest;
  }

  var xhr = createCORSRequest(request.method, request.url);
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  xhr.onload = function () {
    //var responseText = xhr.responseText;
    // process the response.
    request.onResponse(new HttpResponse(xhr));
    clearTimeout(request.timeoutHandler);
  };
  request.timeoutHandler = setTimeout(function () {
    request.onTimeout(new HttpResponse(HTTP.RESPONSE.STATUS.NO_RESPONSE));
    request.timeoutHandler = null;
    clearTimeout(this);
  }, request.timeout || 10000);
  xhr.onProgress = request.onProgress;
  xhr.onerror = function () {
    clearTimeout(request.timeoutHandler);
    request.onResponse(new HttpResponse(HTTP.RESPONSE.STATUS.NO_RESPONSE));
  };
  xhr.send(request.build(xhr));
};
const commLayer = new CommLayer({});
module.exports = {
  CommLayer: {
    Topologies: {
      load(cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.GET,
          url: Config.host + '/api/topology'
        });
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      getAvailableModules(pid, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.GET,
          url: Config.host + '/api/available_modules/?pid=' + pid
        });
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      create(opts, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/newProject'
        });
        request.contentType = 'multipart/form-data';
        request.setFormParam('formData', JSON.stringify(opts));
        request.setFormParam('logo', opts.icon);
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      build(opts, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/build'
        });
        request.contentType = 'multipart/form-data';
        request.setFormParam('formData', JSON.stringify(opts));

        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 300000; // 5 min build time max
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      getManifest(pid, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.GET,
          url: Config.host + '/api/manif/?pid=' + pid + '&ts=' + Date.now()
        });
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      getImages(pid, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/list'
        });
        request.contentType = 'multipart/form-data';
        let form = JSON.stringify({
          pid : pid,
          folder: 'images'
        });
        request.setFormParam('formData', form);

        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 300000; // 5 min build time max
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      getIcons(pid, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/list'
        });
        request.contentType = 'multipart/form-data';
        let form = JSON.stringify({
          pid : pid,
          folder: 'icons'
        });
        request.setFormParam('formData', form);

        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 300000; // 5 min build time max
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      getAudioFiles(pid, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/list'
        });
        request.contentType = 'multipart/form-data';
        let form = JSON.stringify({
          pid : pid,
          folder: 'sounds'
        });
        request.setFormParam('formData', form);

        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 300000; // 5 min build time max
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      uploadFile(opts, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/upload'
        });
        request.contentType = 'multipart/form-data';
        request.setFormParam('formData', JSON.stringify(opts));
        request.setFormParam('file', opts.file);
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      deleteFile(opts, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/delete'
        });
        request.contentType = 'multipart/form-data';
        request.setFormParam('formData', JSON.stringify(opts));
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      },
      toggleModule(opts, cb){
        let request = commLayer.serverRequestFactory({
          type: COMM_LAYER.PROTOCOL.HTTP,
          method: HTTP.REQUEST.METHOD.POST,
          url: Config.host + '/api/toggle_module'
        });
        request.contentType = 'multipart/form-data';
        request.setFormParam('formData', JSON.stringify(opts));
        request.onResponse = curry(this, function (response) {
          if (response.status === HTTP.RESPONSE.STATUS.OK.code) {
            cb(null, response.body);
          } else {
            cb({
              logged: false,
              message: response.message || response.body
            });
          }
        });
        request.onRejected = function () {
          cb({
            logged: false,
            message: 'Request rejected'
          });
        };
        request.timeout = 30000;
        request.onTimeout = function () {
          cb({
            logged: false,
            message: 'Request timed out. '
          });
        };
        commLayer.sendRequest(request);
      }
    }
  }
};
