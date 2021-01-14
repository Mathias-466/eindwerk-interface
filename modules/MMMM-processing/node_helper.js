var NodeHelper = require("node_helper");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'outlook',
	auth: { 
	  user: 'interface.helper@outlook.com',
	  pass: 'Wachtwoord123!'
	}
  });

module.exports = NodeHelper.create({
	start: function() {
		var events = [];

		this.fetchers = [];

		console.log("Starting node helper for: " + this.name);

	},

	SendEmail: function(data){
		
	var mailOptions = {
 		from: 'interface.helper@outlook.com',
  		to: data.reciever,
  		subject: 'Geen reactie op melding',
  		text: "Er werd niet gereageerd op volgende melding: " + data.message
	};

	transporter.sendMail(mailOptions, function(error, info){
  	if (error) {
    	console.error(error);
  	} else {
    	console.log('Email sent: ' + info.response);
	  }
	  
	});
	return;
	},
	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "SEND_EMAIL") {
			console.log("HELPER RECIEVED: email request");
			this.SendEmail(payload);
		}
	},
					
});
