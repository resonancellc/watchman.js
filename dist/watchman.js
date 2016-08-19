'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.Watchman = function () {
  var _ref;

  var attributes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


  var CHANGE = 'change';
  var REMEMBER = 'remember';
  var RESTORE = 'restore';

  var subscribers = {};
  var methods = {};
  var _states = [];
  var properties = {};

  var _event = function _event(type, prop, data) {
    return {
      type: type, prop: prop, data: data
    };
  };
  var _isset = function _isset(value) {
    return value !== undefined;
  };

  return _ref = {
    invoke: function invoke(event) {
      var _this = this;

      var method = methods[event];

      if (!method) return;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = method.call.apply(method, [_this].concat(args));

        _this.trigger.apply(_this, [event].concat(args));
        return result;
      };
    },
    register: function register(event, method) {

      methods[event] = method;
      return this;
    },
    trigger: function trigger(event) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var callbacks = subscribers[event.type || event];

      if (!callbacks) return;

      callbacks.forEach(function (callback) {
        return callback.call.apply(callback, [_this2, event].concat(args));
      });

      return this;
    },
    off: function off(event, subscriber) {
      var callbacks = subscribers[event];

      if (!callbacks) return;

      if (!subscriber) {
        delete subscribers[event];
      } else {
        subscribers[event] = callbacks.filter(function (callback) {
          return subscriber !== callback;
        });
      }

      return this;
    },
    on: function on(event, callback) {

      subscribers[event] = subscribers[event] || [];
      subscribers[event].push(callback);
      return this;
    },
    states: function states(property) {

      if (property) {
        return properties[property];
      } else {
        return _states;
      }
    },
    remember: function remember(property) {
      var value;

      if (property) {
        value = attributes[property];
        properties[property] = properties[property] || [];
        properties[property].push(value);
      } else {
        value = Object.assign({}, attributes);
        _states.push(value);
      }

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      this.trigger.apply(this, [_event(REMEMBER, property, value)].concat(args));
      return this;
    },
    restore: function restore(property) {
      var value;

      if (property) {
        value = (properties[property] || []).pop();
        attributes[property] = _isset(value) ? value : attributes[property];
      } else {
        value = _states.pop();
        attributes = value || attributes;
      }

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      this.trigger.apply(this, [_event(RESTORE, property, value)].concat(args));
      return this;
    },
    unset: function unset(property) {
      var success = true;

      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      if (property) {
        success = delete attributes[property];

        this.trigger.apply(this, [_event(CHANGE, property, success)].concat(args));
      } else {
        attributes = {};
        this.trigger.apply(this, [_event(CHANGE, property, success)].concat(args));
      }

      return this;
    }
  }, _defineProperty(_ref, 'states', function states(property) {

    if (property) {
      return properties[property];
    } else {
      return _states;
    }
  }), _defineProperty(_ref, 'set', function set(property, value) {
    for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
      args[_key6 - 2] = arguments[_key6];
    }

    if (typeof property === 'string') {
      attributes[property] = value;
    } else {
      args = [value].concat(_toConsumableArray(args));
      value = property;
      property = undefined;
      Object.assign(attributes, value);
    }

    this.trigger.apply(this, [_event(CHANGE, property, value)].concat(_toConsumableArray(args)));
    return this;
  }), _defineProperty(_ref, 'get', function get(property) {

    if (property) {
      return attributes[property];
    } else {
      return Object.assign({}, attributes);
    }
  }), _ref;
};