Module.register("firebase-module",{
	// Module config defaults.
	defaults: {

	},
	// Define required scripts.
	getScripts: function() {
	},
	// Define styles.
	getStyles: function() {
		
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
	}
});
