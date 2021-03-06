'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Watchman.js
 *
 * @author m3g4p0p
 */
(window === undefined ? global : window).Watchman = function () {
  var subject = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


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

  return {

    ////////////////////
    // Change methods //
    ////////////////////

    get: function get() {
      for (var _len = arguments.length, properties = Array(_len), _key = 0; _key < _len; _key++) {
        properties[_key] = arguments[_key];
      }

      if (properties.length === 1) {
        return subject[properties[0]];
      } else if (properties.length > 1) {
        return properties.reduce(function (obj, key) {
          return Object.defineProperty(obj, key, { value: subject[key] });
        }, {});
      } else {
        return Object.assign({}, subject);
      }
    },
    set: function set(property, value) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      if (typeof property === 'string') {
        subject[property] = value;
      } else {
        args = [value].concat(_toConsumableArray(args));
        value = property;
        property = undefined;
        Object.assign(subject, value);
      }

      this.trigger.apply(this, [_event(CHANGE, property, value)].concat(_toConsumableArray(args)));

      return this;
    },
    unset: function unset(property) {
      var success = true;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (property) {
        success = delete subject[property];

        this.trigger.apply(this, [_event(CHANGE, property, success)].concat(args));
      } else {
        subject = {};
        this.trigger.apply(this, [_event(CHANGE, property, success)].concat(args));
      }

      return this;
    },


    ///////////////////
    // Event methods //
    ///////////////////

    on: function on(event, callback) {

      subscribers[event] = subscribers[event] || [];
      subscribers[event].push(callback);

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
    trigger: function trigger(event) {
      var _this = this;

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var callbacks = subscribers[event.type || event];

      if (!callbacks) return;

      if (typeof event === 'string') {
        event = _event(event);
      }

      callbacks.forEach(function (callback) {
        return callback.call.apply(callback, [_this, event].concat(args));
      });

      return this;
    },


    //////////////////////////
    // Custom event methods //
    //////////////////////////

    register: function register(event, method) {

      methods[event] = method;

      return this;
    },
    invoke: function invoke(event) {
      var method = methods[event];

      if (!method) return;

      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      var result = method.call.apply(method, [this].concat(args));
      this.trigger.apply(this, [event].concat(args));

      return result;
    },


    ///////////////////////////
    // State handler methods //
    ///////////////////////////

    remember: function remember(property) {
      var value;

      if (property) {
        value = subject[property];
        properties[property] = properties[property] || [];
        properties[property].push(value);
      } else {
        value = Object.assign({}, subject);
        _states.push(value);
      }

      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      this.trigger.apply(this, [_event(REMEMBER, property, value)].concat(args));

      return this;
    },
    restore: function restore(property) {
      var value;

      if (property) {
        value = (properties[property] || []).pop();
        subject[property] = _isset(value) ? value : subject[property];
      } else {
        value = _states.pop();
        subject = value || subject;
      }

      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      this.trigger.apply(this, [_event(RESTORE, property, value)].concat(args));

      return this;
    },
    states: function states(property) {

      if (property) {
        return properties[property].slice();
      } else {
        return _states.map(function (object) {
          return Object.assign({}, object);
        });
      }
    }
  };
};