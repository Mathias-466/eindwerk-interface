var NodeHelper = require("node_helper");
var nodemailer = require('nodemailer');
const { config } = require("chai");

if(config.OS === "RPI"){
var {PythonShell} = require('python-shell')
var pyshell = new PythonShell('/home/pi/Documents/Eindwerk_STEM/eindwerk-interface/python/code.py');
}

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
		var self = this;
	var mailOptions = {
 		from: 'interface.helper@outlook.com',
  		to: data.reciever,
  		subject: 'Geen reactie op melding voor: ' + data.owner,
		text: data.owner + " heeft niet gereageerd op volgende melding: " + data.message,
		html: self.GetHtmlTemplate(data), 
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
    
    socketNotificationReceived: function(notification, payload) {
		if (notification === "SEND_EMAIL") {
			console.log("HELPER RECIEVED: email request");
			this.SendEmail(payload);
        }
        
        if (notification === "CHANGE_RPI_OUTPUT") {
			this.RPIIO(payload);
        }
/*

pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
});
*/
    },
    
    RPIIO: function(instruction){
        var self = this;
        console.log("Request to RPI: " + instruction);
if(pyshell){
       
		pyshell.send(instruction);
          
}else{console.log("NO SHELL DECLARED");}
    },

	GetHtmlTemplate: function(data){
		var html = `
		<div>
        <div style="background:#4DBFBF;background-color:#4DBFBF;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#4DBFBF;background-color:#4DBFBF;width:100%;">
                <tbody>
                    <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                <tr>
                                    <td style="width:216px;">
                                        <img alt="Robot image" height="189" src="https://assets.opensourceemails.com/imgs/neopolitan/robot-happy.png" style="border:none;display:block;font-size:13px;height:189px;outline:none;text-decoration:none;width:100%;" width="216">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="color:#FFFFFF;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:36px;line-height:1;text-align:center;">
                                Melding
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="color:#187272;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:20px;text-align:center;">
                                Sensoren hebben afwijkende metingen waargenomen en er werd niet gereageerd op een melding van het systeem.
                                <br>
                                <br>
                                Hieronder de desbetreffende melding van ` + data.owner + `:
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div style="background:#F5774E;background-color:#F5774E;margin:0px auto;max-width:600px;">
            <table  align="center">
                <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="color:#933F24;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:20px;text-align:center;">
						` + data.message +`
                        </div>
                    </td>
                </tr>
            </table>

        </div>


        <div style="background:#414141;background-color:#414141;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#414141;background-color:#414141;width:100%;">
                <tbody>
                    <tr>          
                       <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="color:#BBBBBB;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:1;text-align:center;">
                                U kan niet reageren op dit bericht
                            </div>
                       </td>                                    
                    </tr>
                </tbody>
            </table>
        </div>
   </div>
		`;

		return html;
	}
					
});
