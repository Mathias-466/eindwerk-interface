Module.register("MMMM-processing",{
	// Module config defaults.
	defaults: {

	},



	// Define required scripts.
	getScripts: function() {
		return [];
	},
	// Define start sequence.
	start: function() {

		Log.info("Starting module: " + this.name);

		var self = this;
		

	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		// Return the wrapper to the dom.
		return wrapper;
    },
    

    notificationReceived: function(notification, payload, sender) {
        if (notification == "FIREBASE_DATA-UPDATE") {
            console.log("Updated firebase data: ",  payload);
        } 
    }


});