/**
 * notificationFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
// jscs:disable
;(function(window) {

	"use strict";

	var docElem = window.document.documentElement,
		support = {animations: Modernizr.cssanimations},
		animEndEventNames = {
			"WebkitAnimation": "webkitAnimationEnd",
			"OAnimation": "oAnimationEnd",
			"msAnimation": "MSAnimationEnd",
			"animation": "animationend"
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed("animation") ];

	/**
	 * extend obj function
	 */
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * NotificationFx function
	 */
	function NotificationFx(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	/**
	 * NotificationFx options
	 */
	NotificationFx.prototype.options = {
		// element to which the notification will be appended
		// defaults to the document.body
		wrapper: document.body,
		// the message
		message: "yo!",
		// layout type: growl|attached|bar|other
		layout: "growl",
		// effects for the specified layout:
		// for growl layout: scale|slide|genie|jelly
		// for attached layout: flip|bouncyflip
		// for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
		// ...
		effect: "slide",
		// notice, warning, error, success
		// will add class ns-type-warning, ns-type-error or ns-type-success
		type: "notice",
		// if the user doesn´t close the notification then we remove it
		// after the following time
		ttl: 86400,
		al_no: "ns-box",

		IDNumber: "",

		timestamp: 0,
		
		module: [],

		// callbacks
		onClose: function() { return false; },
		onOpen: function() { return false; }
	};

	/**
	 * init function
	 * initialize and cache some vars
	 */
	NotificationFx.prototype._init = function() {
		// create HTML structure
	//	console.log(this.options);
		this.ntf = document.createElement("div");
		this.ntf.className = this.options.al_no +  " ns-" + this.options.layout + " ns-effect-" + this.options.effect + " ns-type-" + this.options.type;
		var strinner = "<div class=\"ns-box-inner\">";
		strinner += this.options.message; //add the message in HTML-form

		strinner += "</div>";
		this.ntf.innerHTML = strinner;

		// append to body or the element specified in options.wrapper
		this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.nextSibling);

		// dismiss after [options.ttl]ms
		var self = this;

		
		if (this.options.ttl) {
			this.dismissttl = setTimeout(function() {
			if (self.active) {
				self.dismiss();
			}
		}, this.options.ttl);
		}

		// init events
		this._initEvents();
	};

	/**
	 * init events
	 */
	NotificationFx.prototype._initEvents = function() {
		var self = this;
		// dismiss notification by tapping on it if someone has a touchscreen
		this.ntf.querySelector(".ns-box-inner").addEventListener("click", function() { self.dismiss(); });
	};

	/**
	 * show the notification
	 */
	NotificationFx.prototype.show = function() {
		this.active = true;
		classie.remove(this.ntf, "ns-hide");
		classie.add(this.ntf, "ns-show");
		this.options.onOpen();
		this.options.module.sendNotification("ALERT_OPENED",this.options);
	};

	/**
	 * dismiss the notification
	 */
	NotificationFx.prototype.dismiss = function() {
		var self = this;
		this.active = false;
	//	console.log(self.options);
		self.options.module.sendNotification("ALERT_CLOSED",self.options.IDNumber);
		clearTimeout(this.dismissttl);
		classie.remove(this.ntf, "ns-show");
		setTimeout(function() {
			classie.add(self.ntf, "ns-hide");

			// callback
			self.options.onClose();
		}, 25);

		// after animation ends remove ntf from the DOM
		var onEndAnimationFn = function(ev) {
			if (support.animations) {
				if (ev.target !== self.ntf) return false;
				this.removeEventListener(animEndEventName, onEndAnimationFn);
			}

			if (this.parentNode === self.options.wrapper) {
				self.options.wrapper.removeChild(this);
			}
		};

		if (support.animations) {
			this.ntf.addEventListener(animEndEventName, onEndAnimationFn);
		} else {
			onEndAnimationFn();
		}
	};

	/**
	 * add to global namespace
	 */
	window.NotificationFx = NotificationFx;

})(window);
