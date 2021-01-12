Module.register("MMMM-data-display",{
            // Module config defaults.
            defaults: {
        
            },
            
            FirebaseData: [],
            showSensorData: false,
        
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
                var togglebutton = document.createElement("button");
                togglebutton.innerHTML = "Open overzicht";
        
                wrapper.appendChild(togglebutton);
                
                togglebutton.addEventListener ("click", function() {
                    this.showSensorData = !this.showSensorData;
                  });

                var wrapper = document.createElement("div");
        
                return wrapper;
            },
            
            
        
            notificationReceived: function(notification, payload, sender) {
                if (notification == "FIREBASE_DATA-UPDATE") {
                    console.log("Updated firebase data: ",  payload);
                    this.FirebaseData = payload;
                } 
            }
        
        
        });