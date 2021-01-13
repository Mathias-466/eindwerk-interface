Module.register("MMMM-processing",{
	// Module config defaults.
	defaults: {
	minTemp: 	18,
	maxTemp:	25,
	reactionTime: 900000 //15min (in milliseconden)

	},
	
	FirebaseData: [],
	OpenNotifications:[],
	Tempwarning: false,

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

		return wrapper;
    },
	
	

    notificationReceived: function(notification, payload, sender) {
        if (notification === "FIREBASE_DATA-UPDATE") {
			console.log("Updated firebase data: ",  payload);
			this.CheckSensors(payload.Sensoren);

		} 
		
		if (notification === "ALERT_CLOSED") {
			console.log("Notification closed: ",  payload.IDNumber);
	
		} 
	},

	CheckDoorsWindows: function(data){
		var self = this;
		var openDWLoc = "";
		for(var i=0;i<data.length;i++){
			if(data[i].Waarde){ //if door value = 1, the door/window is open
				openDWLoc += data[i].Plaats + " en ";
			}
		}
		if (typeof openDWLoc !== 'undefined' && openDWLoc.length > 0) {
			self.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing", message: "Controleer uw verwarming en de deuren en ramen in: "+ openDWLoc.slice(0, -4).toLowerCase(), IDNumber: 01});        
		}else{
			self.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing", message: "Controleer uw verwarming", IDNumber: 01});        
		}
		this.Tempwarning = true;
	},

	Checktemp: function(fulldata){
		var mintemp = this.config.minTemp;
		var maxtemp = this.config.maxTemp;
		var self = this;
		if(!self.Tempwarning){
		var tempData = fulldata.Temperatuur;
		var DWData = fulldata.DeurRaam;
		
	for(var i=0;i<tempData.length;i++){
			if(tempData[i].Waarde < mintemp || tempData[i].Waarde > maxtemp){
				console.log("WARNING: TEMP OOR");
				self.CheckDoorsWindows(DWData);	
				break;
			}	
		}
	}
	},

	CheckCO: function(data){

	},
	
	CheckSensors: function(data){
		this.Checktemp(data);
		this.CheckCO(data.Gasmelder);
	}


});