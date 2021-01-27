Module.register("MMMM-data-display",{

  defaults: {
        
    },

    FirebaseData: [],
    showSensorData: false,
    isActiveState:  "Inactief",
        
   /*
    getScripts: function() {
        return [];
    },
         */   

    start: function() {
        
        Log.info("Starting module: " + this.name);
                        
    },

    // Override dom generator.
    getDom: function() {
    var self = this;
        var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin medium bright pre-line";
        
        
        var compliment = document.createElement("span")
        compliment.appendChild(document.createTextNode(self.isActiveState));
		
		
		
	    wrapper.appendChild(compliment);

		return wrapper;
        
    },
            
            
        
    notificationReceived: function(notification, payload, sender) {
        if (notification == "FIREBASE_DATA-UPDATE") {
            //  console.log("Updated firebase data: ",  payload);
            this.FirebaseData = payload;
        } 

        if (notification == "ISACTIVE_STATE") {
            if(payload){
                this.isActiveState = "Actief";
            }else{this.isActiveState = "Inactief";}
            
            this.updateDom();
        }

        }
        
        
});