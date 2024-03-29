Module.register("MMMM-processing",{
	// Module config defaults.
	defaults: {
		minTemp: 	18,
		maxTemp:	25,
		reactionTime: 900000, //15min (in milliseconden) //time it takes to respond on a notification before a warning(email) is send
		//snoozeTime: 900000, //time between closing notification and recieving the same notification if there is no change in values 
		snoozeTime: 2*60*1000,
		contactPersoon: "mathias.jespers@gmail.com",
		InactiveTime: "23:15-7:30",
		//InactiveTime: "14:41-14:45",	
	},
	
	FirebaseData: "",
	OpenNotifications:[],
	Tempwarning: false,
	Gaswarning: false,
	IDNumber: 1,
	CheckEvery: 2*60*1000, //2min //for timestamps
	isActive: false,
	RPIIOon: false, //if the output of the RPI is set

	// Define required scripts.
	getScripts: function() {
		return [];
	},
	// Define start sequence.
	start: function() {

		Log.info("Starting module: " + this.name);
		
	},
	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");

		return wrapper;
    },
	
	

    notificationReceived: function(notification, payload, sender) {
		if (notification === "ALL_MODULES_STARTED") {
			this.CheckTimestamps();
			this.CheckActiveTime(this.config.InactiveTime);
		} 
        if (notification === "FIREBASE_DATA-UPDATE") {
			console.log("Updated firebase data: ",  payload);
			this.FirebaseData = payload;
			if(this.isActive){
				this.CheckSensors(payload.Sensoren);
			}
		} 
		
		if (notification === "ALERT_CLOSED") {
			//console.log("Notification closed: ",  payload);
			this.removeNotification(payload);
			this.setRPIOI();
			this.CheckTypes();
		} 
		else if (notification === "ALERT_OPENED") {
			//console.log("Notification opened: ",  payload);
			this.OpenNotifications.push(payload);
			this.setRPIOI();
			this.sendPythonNotification("SOUND_NEWMESSAGE");
		} 
	},

	CheckDoorsWindows: function(data){
		var self = this;
		var openDWLoc = "";  //string with the place of open doors and windows
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

	if(!self.Gaswarning){  // if there is no existing temp warning
		for(var i=0;i<data.length;i++){
			if(data[i].Waarde == 1){
				console.log("WARNING: GAS OOR");
				this.sendNotification("SHOW_ALERT", {type: "notification",title: "Waarschuwing ", message: "Controleer uw verluchting", IDNumber: self.IDNumber, typeWarning: "gas"});
				this.IDNumber += 1;
				self.Gaswarning = true;
				break;
			}	
		}
	}

	
	},
	
	CheckSensors: function(data){
		if(data && data != ""){
			this.Checktemp(data);
			this.CheckCO(data.Gasmelder);
		}
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

		if (typeof this.OpenNotifications !== 'undefined' && this.OpenNotifications.length > 0) {

			/*Check for open temp and gas notifications*/
			var tempFound = false;
			var gasFound = false;

			for(i=0;i<this.OpenNotifications.length;i++){
				//console.log(self.OpenNotifications[i].typeWarning);
				if(self.OpenNotifications[i].typeWarning == "temp"){
					tempFound = true;
				}

				if(self.OpenNotifications[i].typeWarning == "gas"){
					gasFound = true;
				}
			}
		}

		if(!tempFound){ //if there was no temp warning found in the open notifications
			/*Set a timeout to set tempwarning to false the after the snoozing time*/
			setTimeout(function(){
				self.Tempwarning = false;
			}, self.config.snoozeTime);				
			
			console.log("no temp warnings");
		}

		if(!gasFound){
			setTimeout(function(){
				self.Gaswarning = false;
			}, self.config.snoozeTime);	
			
			console.log("no gas warnings");
		}
},

CheckTimestamps: function(){
var self = this;
if(self.isActive){
	var d = new Date();
	console.log("checking timestamps..");
	if (typeof this.OpenNotifications !== 'undefined' && this.OpenNotifications.length > 0) {
		for(i=0;i<this.OpenNotifications.length;i++){
			if(d.getTime() - self.OpenNotifications[i].timestamp > self.config.reactionTime ){
				console.log("ReactionTime passed for: ",self.OpenNotifications[i].IDNumber)
				self.sendSocketNotification("SEND_EMAIL",{
					message: self.OpenNotifications[i].message.replace(/(<([^>]+)>)/gi, ""),
					reciever: self.config.contactPersoon,
					owner:  config.Owner
				});
				self.OpenNotifications.splice(i,1);
			}
		}
	}
}else{  /*If the system is inactive the open notifications can be removed*/ 
	//console.log("removing open notification");
	for(i=0;i<this.OpenNotifications.length;i++){
		self.OpenNotifications.splice(i,1);
	}
}

setTimeout(function(){
	self.CheckTimestamps()
}, self.CheckEvery);	

/*
setTimeout(function(){
	self.CheckTimestamps()
}, 1000);
*/
},


CheckActiveTime: function(data){
	var self = this;	
	var lastActiveState = self.isActive;
	var StartandEndTime = data.split("-");
	var startTime = StartandEndTime[0].split(":");
	var endTime = StartandEndTime[1].split(":");

	var startTimeMin = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
	var endTimeMin = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);

	var d = new Date();
	var nowTimeMin = d.getHours() *60 + d.getMinutes()
	
	if(startTimeMin-endTimeMin > 0){ //night gap (23h-7h)
		if(nowTimeMin<endTimeMin || nowTimeMin > startTimeMin){
			self.isActive = false;
		}else{self.isActive=true;}

	}

	else if(startTimeMin-endTimeMin < 0) { //1 day (20h-23h)
		if(startTimeMin<nowTimeMin && nowTimeMin < endTimeMin){
			self.isActive = false;
		}else{self.isActive=true;}
	}

	self.sendNotification("ISACTIVE_STATE",self.isActive);

	if(lastActiveState!=self.isActive && self.isActive){  //if the state changed from inactive to active
		self.CheckSensors(self.FirebaseData.Sensoren);
		console.log("ACTIVE state changed from inactive to active")
	}
	setTimeout(function(){
		self.CheckActiveTime(self.config.InactiveTime)
	}, 30 *1000);	//30s

},

sendPythonNotification(notification){
var self = this;
if(config.Os == "RPI"){
	self.sendSocketNotification("CHANGE_RPI_OUTPUT",notification);
}

},

setRPIOI: function(){
	var self = this;
if(config.Os == "RPI"){
	if(self.OpenNotifications.length == 0){
		//no output signal
		self.RPIIOon = false;
		self.sendSocketNotification("CHANGE_RPI_OUTPUT","LED_OFF");
	}else{
		//output signal
		if(!self.RPIIOon){ //if there is no output signal active
			self.RPIIOon = true;
			self.sendSocketNotification("CHANGE_RPI_OUTPUT","LED_ON");
		}
	}
}
}

});