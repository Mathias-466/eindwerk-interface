Module.register("MMMM-processing",{
	// Module config defaults.
	defaults: {

	},
	
	FirebaseData: [],

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

		return wrapper;
    },
	
	

    notificationReceived: function(notification, payload, sender) {
        if (notification == "FIREBASE_DATA-UPDATE") {
			console.log("Updated firebase data: ",  payload);
			this.FirebaseData = payload;
			this.CheckData(this.FirebaseData);
		} 

		if (notification == "ALERT_CLOSED") {
			console.log("Notification closed: ",  payload.IDNumber);
	
		} 
	},
	
	CheckData: function(data){

	}


});