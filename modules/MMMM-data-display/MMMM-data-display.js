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

    getStyles: function() {
		return ["MMMM-data-display.css"];
	},

    // Override dom generator.
    getDom: function() {
    var self = this;
    /*wrapper*/
        var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin medium bright pre-line";
        
        /*active state*/
        var activeSpan = document.createElement("span")
        activeSpan.appendChild(document.createTextNode(self.isActiveState));	
        wrapper.appendChild(activeSpan);
        
        wrapper.appendChild(document.createElement("br"));

        /*open button*/
        var btn = document.createElement("BUTTON");
        btn.innerHTML = "Open overzicht";
        btn.className = "Button"  
        btn.onclick = function() {self.togleOpenClose("open")};
        wrapper.appendChild(btn);

        
        if(self.showSensorData && !document.getElementsByClassName("SensorDataDiv")[0] && self.FirebaseData && self.FirebaseData != ""){

         
            var div = document.createElement("div");
            div.className = "SensorDataDiv";
           
            /*close button*/
            var btn = document.createElement("BUTTON");
            btn.onclick = function() {self.togleOpenClose("close")};
            btn.innerHTML = "Sluiten"; 
            btn.className = "Button"  
            div.appendChild(btn);

            div.appendChild(document.createElement("br"));

            var contentdiv = document.createElement("div");
            contentdiv.className = "dataContent";

            /*LISTs*/
            self.MakeList("Deuren en Ramen", self.FirebaseData.Sensoren.DeurRaam, contentdiv);
            self.MakeList("Temperatuur", self.FirebaseData.Sensoren.Temperatuur, contentdiv);
            self.MakeList("Gasmeters", self.FirebaseData.Sensoren.Gasmelder, contentdiv);

            div.appendChild(contentdiv);

            /*append*/
            var fulscreendiv = document.getElementsByClassName("region fullscreen above");
            fulscreendiv[0].appendChild(div);

        }

		return wrapper;
        
    },

    MakeList: function(name,data, parent){
        var NameSpan = document.createElement("span")
        NameSpan.appendChild(document.createTextNode(name));	
        parent.appendChild(NameSpan);

        var ul = document.createElement('ul');
        var type;
        var place;
        var value;
        for(var i=0;i<data.length;i++){
            var li = document.createElement('li');
            li.setAttribute('class','item');

            if (name === "Deuren en Ramen"){
                value = data[i].Waarde == "1" ? "open" : "dicht";
                type = data[i].Type;
                place = data[i].Plaats;
            }else if(name === "Gasmeters"){
                value = data[i].Waarde == "1" ? "gevaar" : "normaal";
                type = data[i].Type;
                place = data[i].Plaats;
            }else if(name === "Temperatuur"){
                value = data[i].Waarde + "°C";
                type = data[i].Type;
                place = data[i].Plaats;
            }
            else{
             type = data[i].Type;
             place = data[i].Plaats;
             value =  data[i].Waarde;
            }

            li.innerHTML=li.innerHTML + type + ", in: " + place.toLowerCase() + " met waarde: " + value;
            ul.appendChild(li);

        }


        parent.appendChild(ul);
    },
            
    togleOpenClose: function(instruction){
        var self = this;
        switch(instruction) {
            case "open":
                self.showSensorData = true;
            break;
            case "close":
                self.showSensorData = false;
                var element = document.getElementsByClassName("SensorDataDiv");
                element[0].parentNode.removeChild(element[0]);
            break;
        }
        self.updateDom();
    },       
        
    notificationReceived: function(notification, payload, sender) {
        if (notification == "FIREBASE_DATA-UPDATE") {
            //  console.log("Updated firebase data: ",  payload);
            this.FirebaseData = payload;
            this.updateDom();

        } 

        if (notification == "ISACTIVE_STATE") {
            if(payload){
                this.isActiveState = "Actief";
            }else{this.isActiveState = "Inactief";}
            this.updateDom();

        }

        }
        
        
});