/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out or empty, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "nl",
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
			     // local for armv6l processors, default
			     //   starts serveronly and then starts chrome browser
			     // false, default for all  NON-armv6l devices
				 // true, force serveronly mode, because you want to.. no UI on this device
				 

	Owner: "Maria de Vries",
	Os: "Windows",

	modules: [

		{
			module: "clock",
			position: "middle_center",
			config:{
			lang: "nl",
			showWeek: false,
			dateFormat: "dddd, l" //day, date (d/m/y)
			}
			
		},
{
		module: "alert",
		config: {
			display_time: 3600000, //1h
		}
	},
	{
		module: "MMMM-firebase",
		position: "top_right",

		config: {
			firebaseConfig: {
				apiKey: "AIzaSyAgyFYGbl6y2XzP-pHo2pAFCTX2_2DFSL0",
				authDomain: "test-42bc4.firebaseapp.com",
				databaseURL: "https://test-42bc4.firebaseio.com",
				projectId: "test-42bc4",
				storageBucket: "test-42bc4.appspot.com",
			   // messagingSenderId: "977128456065",
				appId: "1:977128456065:web:96ba7785ad6ea4d7537280",
				measurementId: "G-PVL9NTZ3FE"
			  },
		}
	},

	{
		module: "MMMM-processing",
		position: "top_left",

	},

	
	{
		module: "MMMM-data-display",
		position: "top_left",

	},	
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
