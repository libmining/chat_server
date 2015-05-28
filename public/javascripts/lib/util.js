/*
 util.js v 1.2.7
 Copyright (c) 2013 SHIFTBRAIN Inc.
 Licensed under the MIT license.
 https://github.com/devjam

 */
(function() {
  if(this.console == null) {
    this.console = {
      log: function() {
      }
    };
  }
  this.Util = (function() {

    Util.UA = (function() {
      var isIPad3, ua, ver, _ua;
      _ua = navigator.userAgent.toLowerCase();
      ua = {
        isIE: false,
        isIE6: false,
        isIE7: false,
        isIE8: false,
        isIE9: false,
        isLtIE9: false,
        isIOS: false,
        isIPhone: false,
        isIPad: false,
        isIPhone4: false,
        isIPad3: false,
        isAndroid: false,
        isAndroidMobile: false,
        isChrome: false,
        isSafari: false,
        isMozilla: false,
        isWebkit: false,
        isOpera: false,
        isPC: false,
        isTablet: false,
        isSmartPhone: false,
        browser: _ua
      };
      if(ua.isIE = /msie\s(\d+)/.test(_ua)) {
        ver = RegExp.$1;
        ver *= 1;
        ua.isIE6 = ver === 6;
        ua.isIE7 = ver === 7;
        ua.isIE8 = ver === 8;
        ua.isIE9 = ver === 9;
        ua.isLtIE9 = ver < 9;
      }
      if(ua.isIE7 && _ua.indexOf('trident/4.0') !== -1) {
        ua.isIE7 = false;
        ua.isIE8 = true;
      }
      if(ua.isIPhone = /i(phone|pod)/.test(_ua)) {
        ua.isIPhone4 = window.devicePixelRatio === 2;
      }
      if(ua.isIPad = /ipad/.test(_ua)) {
        isIPad3 = window.devicePixelRatio === 2;
      }
      ua.isIOS = ua.isIPhone || ua.isIPad;
      ua.isAndroid = /android/.test(_ua);
      ua.isAndroidMobile = /android(.+)?mobile/.test(_ua);
      ua.isPC = !ua.isIOS && !ua.isAndroid;
      ua.isTablet = ua.isIPad || (ua.isAndroid && ua.isAndroidMobile);
      ua.isSmartPhone = ua.isIPhone || ua.isAndroidMobile;
      ua.isChrome = /chrome/.test(_ua);
      ua.isWebkit = /webkit/.test(_ua);
      ua.isOpera = /opera/.test(_ua);
      ua.isMozilla = _ua.indexOf("compatible") < 0 && /mozilla/.test(_ua);
      ua.isSafari = !ua.isChrome && ua.isWebkit;
      return ua;
    })();

    Util.venderPrefix = (function() {
      if(Util.UA.isIE) {
        return "-ms-";
      }
      if(Util.UA.isWebkit) {
        return "-webkit-";
      }
      if(Util.UA.isMozilla) {
        return "-moz-";
      }
      if(Util.UA.isOpera) {
        return "-o-";
      }
      return "";
    })();

    Util.stats = (function() {
      var sts, stsTimer, update;
      sts = null;
      stsTimer = null;
      update = function() {
        if(!(typeof Stats !== "undefined" && Stats !== null) || !(sts != null)) {
          return false;
        }
        stsTimer = requestAnimationFrame(update);
        return sts.update();
      };
      return {
        show: function(mode) {
          if(mode == null) {
            mode = 0;
          }
          if(!(typeof Stats !== "undefined" && Stats !== null) || (sts != null) || Util.UA.isLtIE9) {
            return false;
          }
          sts = new Stats();
          sts.setMode(mode);
          document.body.appendChild(sts.domElement);
          sts.domElement.style.cssText = "position:fixed; top:0; left:0; z-index:9999999;";
          return update();
        },
        remove: function() {
          if(!(typeof Stats !== "undefined" && Stats !== null) || !(sts != null)) {
            return false;
          }
          if(stsTimer != null) {
            cancelAnimationFrame(stsTimer);
          }
          document.body.removeChild(sts.domElement);
          return sts = null;
        }
      };
    })();

    Util.animationFrameDelta = 0;

    (function() {
      var callbacks, isDateHasNow, lastTime, prefix, setDelta;
      isDateHasNow = !!Date.now;
      lastTime = isDateHasNow ? Date.now() : +(new Date);
      callbacks = [];
      setDelta = function(calledTime) {
        Util.animationFrameDelta = calledTime - lastTime;
        lastTime = calledTime;
        window.requestAnimationFrame(setDelta);
      };
      if(!window.requestAnimationFrame) {
        prefix = Util.venderPrefix.replace(/-/g, "");
        window.requestAnimationFrame = window[prefix + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[prefix + "CancelAnimationFrame"] || window[prefix + "CancelRequestAnimationFrame"];
      }
      if(!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
          var id;
          id = 0;
          return function(callback, element) {
            if(callbacks.length === 0) {
              id = setTimeout(function() {
                var cb, cbs, now;
                now = isDateHasNow ? Date.now() : +(new Date);
                cbs = callbacks;
                callbacks = [];
                while(cb = cbs.shift()) {
                  cb(now);
                }
              }, 16);
            }
            if($.inArray != null) {
              if(typeof callback === "function" && $.inArray(callback, callbacks) === -1) {
                callbacks.push(callback);
              }
            } else {
              callbacks.push(callback);
            }
            return id;
          };
        })();
        window.cancelAnimationFrame = function(id) {
          callbacks = [];
          return clearTimeout(id);
        };
      }
      setDelta(isDateHasNow ? Date.now() : +(new Date));
    })();


    function Util() {
      throw new Error('it is static class');
    }

    return Util;

  })();

}).call(this);