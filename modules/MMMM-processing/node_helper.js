var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start: function() {
		var events = [];

		this.fetchers = [];

		console.log("Starting node helper for: " + this.name);

	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "") {
			
		}
	},

			//self.sendSocketNotification("INCORRECT_URL", {url: url});
					
});
