Module.register("MMMM-firebase",{
	// Module config defaults.
	defaults: {

		firebaseConfig: {
			apiKey: "",
			authDomain: "",
			databaseURL: "",
			projectId: "",
			storageBucket: "",
		   // messagingSenderId: "977128456065",
			appId: "",
			measurementId: ""
		  },

		email: "mathias.jespers@gmail.com",
     	password: "wachtwoord"
	},

	 uid : "",
 	database: [],
 	refSet: false,


	// Define required scripts.
	getScripts: function() {
	/* FIREBASE SCRIPT */
		return ["https://www.gstatic.com/firebasejs/3.5.2/firebase.js"];
	},

		/* GET DATA */
	gotData: function(data) {
		if (data != data.val()){
			var data = data.val();
			//console.log(data);
			self.sendNotification('FIREBASE_DATA-UPDATE', data);
		}
		   
	},
		  
		  /* IF ERROR */
	errOc: function(err){
		loggedin = false;
		console.error(err);
	},

	// Define start sequence.
	start: function() {

		Log.info("Starting module: " + this.name);

		var self = this;
		
		firebase.initializeApp(self.config.firebaseConfig);
		this.FirebaseLogIn();

	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		// Return the wrapper to the dom.
		return wrapper;
	},

	FirebaseLogIn: function(){
	self = this;
	/*LOG-IN */
    firebase.auth().signInWithEmailAndPassword(this.config.email, this.config.password).catch(this.errOc);

    firebase.auth().onAuthStateChanged(function (user) {
    //console.log("auth state changed");
		
	if (user) {
        self.database = firebase.database();  
    	self.uid = user.uid;
		
		if (!self.refSet){
			var ref = self.database.ref('Users/' + self.uid );
			ref.on("value", self.gotData, self.errOc);
        	//console.log("refset");
        	self.refSet = true;
    	}

    } 
	});
	
	},

});