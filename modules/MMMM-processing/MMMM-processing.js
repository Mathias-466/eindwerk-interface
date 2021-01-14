Module.register("MMMM-processing",{
	// Module config defaults.
	defaults: {
	minTemp: 	18,
	maxTemp:	25,
	//reactionTime: 900000, //15min (in milliseconden)
	reactionTime: 5000,
	snoozeTime: 900000, //time between closing notification and recieving the same notification if there is no change in values 
	contactPersoon: "mathias.jespers@gmail.com"
	},
	
	FirebaseData: [],
	OpenNotifications:[],
	Tempwarning: false,
	IDNumber: 1,
	CheckEvery: 300000, //5min //for timestamps

	// Define required scripts.
	getScripts: function() {
		return [];
	},
	// Define start sequence.
	start: function() {

		Log.info("Starting module: " + this.name);

		this.CheckTimestamps();
		
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
			//console.log("Notification closed: ",  payload);
			this.removeNotification(payload);
			this.CheckTypes();
		} 
		else if (notification === "ALERT_OPENED") {
			//console.log("Notification opened: ",  payload);
			this.OpenNotifications.push(payload);
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
			self.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing ", message: "Controleer uw verwarming en de deuren en ramen in: "+ openDWLoc.slice(0, -4).toLowerCase(), IDNumber: self.IDNumber, typeWarning: "temp"});   
     
		}else{
			self.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing ", message: "Controleer uw verwarming", IDNumber: self.IDNumber, typeWarning: "temp"});        
		}
		self.IDNumber += 1;
		self.Tempwarning = true;
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
	var self = this;
		this.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing ", message: "Controleer uw Verluchting", IDNumber: self.IDNumber, typeWarning: "gas"});
		this.IDNumber += 1;
		
	},
	
	CheckSensors: function(data){
		this.Checktemp(data);
		this.CheckCO(data.Gasmelder);
	},

	removeNotification: function(data){
		var self = this;
		for(i=0;i<this.OpenNotifications.length;i++){
			if(self.OpenNotifications[i].IDNumber == data){
				self.OpenNotifications.splice(i,1);
				break;
			}
		}
		console.log("Open notification: " + this.OpenNotifications.length);
	},

	CheckTypes: function(){
		var self =this;
		var tempTimeout;
		var d = new Date();
		if (typeof this.OpenNotifications !== 'undefined' && this.OpenNotifications.length > 0) {

		var tempFound = false;
		for(i=0;i<this.OpenNotifications.length;i++){
			//console.log(self.OpenNotifications[i].typeWarning);
			if(self.OpenNotifications[i].typeWarning == "temp"){
				tempFound = true;
			}
		}
	}

	if(!tempFound){
		if(!tempTimeout){
			tempTimeout = setTimeout(function(){
				self.Tempwarning = false;
			}, self.config.snoozeTime);	
		}
		console.log("no temp warnings");
	}
},

CheckTimestamps: function(){
var self = this;
var d = new Date();

if (typeof this.OpenNotifications !== 'undefined' && this.OpenNotifications.length > 0) {
	for(i=0;i<this.OpenNotifications.length;i++){
		if(d.getTime() - self.OpenNotifications[i].timestamp > self.config.reactionTime ){
			console.log("ReactionTime passed for: ",self.OpenNotifications[i].IDNumber)
			self.sendSocketNotification("SEND_EMAIL",{
				message: self.OpenNotifications[i].message.replace(/(<([^>]+)>)/gi, ""),
				reciever: self.config.contactPersoon
			});
			self.OpenNotifications.splice(i,1);
		}
	}
}
/*
	setTimeout(function(){
		self.CheckTimestamps()
	}, self.CheckEvery);	
*/
setTimeout(function(){
	self.CheckTimestamps()
}, 1000);
}

});