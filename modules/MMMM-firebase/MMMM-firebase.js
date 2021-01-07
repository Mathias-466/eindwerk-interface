Module.register("MMMM-firebase",{
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
        this.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing", message: "Dit is een test.", IDNumber: 01});
        
		var wrapper = document.createElement("div");


		// Return the wrapper to the dom.
		return wrapper;
	}
});