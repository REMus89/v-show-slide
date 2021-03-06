!(function(t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? e(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], e)
    : e(((t = t || self).VShowSlide = {}))
})(this, function(t) {
  'use strict'
  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */ var e = function() {
    return (e =
      Object.assign ||
      function(t) {
        for (var e, i = 1, n = arguments.length; i < n; i++)
          for (var s in (e = arguments[i]))
            Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s])
        return t
      }).apply(this, arguments)
  }
  var i = {
    easingOptions: {
      builtIn: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
      custom: {},
    },
    targets: [],
    install: function(t, e) {
      this.validateOptions(e),
        t.directive('show-slide', {
          bind: this.bind.bind(this),
          inserted: this.inserted.bind(this),
          componentUpdated: this.componentUpdated.bind(this),
        })
    },
    bind: function(t, e) {
      this.parseArgs(t, e)
    },
    inserted: function(t, e) {
      this.initializeTarget(t, e.value)
    },
    componentUpdated: function(t, e) {
      this.toggleSlide(t, e)
    },
    getTargetByEl: function(t) {
      var e = this.targets.filter(function(e) {
        return e.el.isSameNode(t)
      })[0]
      if (void 0 === e) throw 'Element not found!'
      return e
    },
    setTargetPropertyByEl: function(t, i, n) {
      var s,
        o = this.getTargetByEl(t),
        r = this.targets.filter(function(e) {
          return !e.el.isSameNode(t)
        })
      this.targets = (function() {
        for (var t = 0, e = 0, i = arguments.length; e < i; e++)
          t += arguments[e].length
        var n = Array(t),
          s = 0
        for (e = 0; e < i; e++)
          for (var o = arguments[e], r = 0, a = o.length; r < a; r++, s++)
            n[s] = o[r]
        return n
      })(r, [e(e({}, o), ((s = {}), (s[i] = n), s))])
    },
    validateOptions: function(t) {
      void 0 !== t &&
        Object.prototype.hasOwnProperty.call(t, 'customEasing') &&
        (this.easingOptions.custom = t.customEasing)
    },
    kebabToCamel: function(t) {
      return t.replace(/-([a-z])/g, function(t) {
        return t[1].toUpperCase()
      })
    },
    fireEvent: function(t, e) {
      if ('function' == typeof window.CustomEvent)
        t.dispatchEvent(new CustomEvent(e))
      else {
        var i = document.createEvent('CustomEvent')
        i.initCustomEvent(e, !1, !1, null), t.dispatchEvent(i)
      }
    },
    parseArgs: function(t, e) {
      if (
        Object.prototype.hasOwnProperty.call(e, 'arg') &&
        'string' == typeof e.arg
      ) {
        var i = e.arg.split(':'),
          n = this.validateEasing(i),
          s = this.validateDuration(i)
        this.targets.push({
          el: t,
          duration: s,
          durationInSeconds: s / 1e3 + 's',
          easing: n,
          isAnimating: !1,
        })
      } else
        this.targets.push({
          el: t,
          duration: 300,
          durationInSeconds: '0.3s',
          easing: 'ease',
          isAnimating: !1,
        })
    },
    validateEasing: function(t) {
      return Object.prototype.hasOwnProperty.call(t, 1)
        ? this.easingOptions.builtIn.indexOf(t[1]) > -1
          ? t[1]
          : Object.prototype.hasOwnProperty.call(
              this.easingOptions.custom,
              this.kebabToCamel(t[1])
            )
          ? this.easingOptions.custom[this.kebabToCamel(t[1])]
          : 'ease'
        : 'ease'
    },
    validateDuration: function(t) {
      return Object.prototype.hasOwnProperty.call(t, 0) ? parseInt(t[0]) : 300
    },
    initializeTarget: function(t, e) {
      e || ((t.style.height = '0px'), (t.style.visibility = 'hidden'))
      var i = this.getTargetByEl(t),
        n = i.easing,
        s = i.durationInSeconds
      t.style.transition = 'height ' + n + ' ' + s
    },
    toggleSlide: function(t, e) {
      e.value !== e.oldValue &&
        (e.value ? this.slideOpen(t) : this.slideClosed(t))
    },
    slideOpen: function(t) {
      var e = this
      this.fireEvent(t, 'slide-open-start')
      var i = this.getTargetByEl(t),
        n = i.isAnimating,
        s = i.timeout,
        o = i.duration
      n && clearTimeout(s),
        this.setTargetPropertyByEl(t, 'isAnimating', !0),
        (t.style.visibility = 'visible'),
        (t.style.overflow = 'hidden')
      var r = t.scrollHeight,
        a = window.getComputedStyle(t),
        l = parseFloat(a.getPropertyValue('border-bottom-width')),
        u = parseFloat(a.getPropertyValue('border-top-width'))
      t.style.height = r + l + u + 'px'
      var d = setTimeout(function() {
        ;(t.style.height = 'auto'),
          e.setTargetPropertyByEl(t, 'isAnimating', !1),
          e.fireEvent(t, 'slide-open-end'),
          (t.style.overflow = 'visible')
      }, o)
      this.setTargetPropertyByEl(t, 'timeout', d)
    },
    slideClosed: function(t) {
      var e = this
      this.fireEvent(t, 'slide-close-start'),
        (t.style.overflow = 'hidden'),
        (t.style.visibility = 'hidden')
      var i = this.getTargetByEl(t),
        n = i.isAnimating,
        s = i.timeout,
        o = i.duration
      n && clearTimeout(s), this.setTargetPropertyByEl(t, 'isAnimating', !0)
      var r = t.scrollHeight
      t.style.height = r + 'px'
      t.offsetLeft
      t.style.height = '0px'
      var a = setTimeout(function() {
        e.setTargetPropertyByEl(t, 'isAnimating', !1),
          (t.style.visibility = 'hidden'),
          e.fireEvent(t, 'slide-close-end'),
          (t.style.overflow = 'visible')
      }, o)
      this.setTargetPropertyByEl(t, 'timeout', a)
    },
  }
  ;(t.default = i), Object.defineProperty(t, '__esModule', { value: !0 })
})
