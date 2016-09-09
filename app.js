var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require('mysql');

var routes = require('./routes/index');
var users = require('./routes/users');
var router = express.Router();
var fileUpload = require('express-fileupload');

var app = express();
app.use(fileUpload());

var net = require('net');
var HOST = '192.168.111.33';
var TPORT = 3000;

var error;
var socket;
var connect;

var connection = mysql.createConnection({
    host        : 'localhost',
    port        : '3306',
    user        : 'root',
    password    : '0147852',
    database    : 'database',
    socketPath  : '/var/lib/mysql/mysql.sock'
});

connection.connect();
console.log('Socket status' + ': ' + socket);

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function (sock) {
  // We have a connection - a socket object is assigned to the connection automatically
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
  // Add a 'data' event handler to this instance of socket
  sock.on('error', function(err){
    console.log('Error: ', err);
    throw err;
  });
  sock.on('data', function(data) {
  console.log('DATA ' + sock.remoteAddress + ': ' + data);
   
   var time = (new Date).toLocaleTimeString();
   var msg = data.toString();
   var mlength = msg.length;

   console.log(mlength+ ' length ');
   var comm_str = msg.substr(1,msg.length-2);
   var trim_str =  comm_str.split("][");

   socket = sock;

   while (trim_str.length >0) {
      var pos_array = [];
      var pos_array = trim_str[0].split(",");
   

      if (pos_array.length === 4 || pos_array.length === 1) {

        console.log('Log: ' + ' : ' + msg.toString());

      }  else if (pos_array.length === 2) {

        var buffer_log = msg.substring(28);
        var encodedUtf8 = Encoding.UTF8.GetBytes(buffer_log);
        // format the data into base-64:
        var base64 = Convert.ToBase64String(encodedUtf8);
        console.log('Buffer Log: ', base64);

        connection.end();
         
      } else {

        var state = pos_array[16];
      //  state = state.toString();
        console.log('State: ', state);
        var watch_st = "";

          switch(state) {
            case "00000000":
              console.log('Состояние часов в норме, часы на руке');
              watch_st = "Состояние часов в норме, часы на руке";
              break;
            case "00000008":
              console.log('Cостояние часов в норме, часы сняты с руки');
              watch_st = "Cостояние часов в норме, часы сняты с руки";
              break;
            case "00010000":
              console.log('SOS');
              watch_st = "SOS";
              break;
            case "00100008":
              console.log('SOS!!!, часы сняты с руки');
              watch_st = "SOS!!!, часы сняты с руки";
              break;
            case "00000009":
              console.log('Низкий заряд батареи');
              watch_st = "Низкий заряд батареи";
              break;
            case "00000001":
              console.log('Часы отключились');
              watch_st = "Часы отключились";
            default:
              console.log('Default state'); 
          }

          var datas = {
            device_id: pos_array[0].substr(0,pos_array[0].indexOf('*',3)),
            date: pos_array[1],
            time: pos_array[2],
            latitude: pos_array[4],
            longitude: pos_array[6],
            speed: pos_array[8],
            altitude: pos_array[10],
            terminal_state: pos_array[16],
            watch_state_msg: watch_st
          };
          
            console.log('Datas: ', datas);

            connection.query('INSERT INTO datas SET ?', datas, function(err, result) {
              if (err) throw err;

              console.log(pos_array[0] + ' datas inserted');
              console.log('Result: ', result);
            });
      }

      trim_str.shift();
    }
  });

  /*// Add a 'close' event handler to this instance of socket
  sock.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    error = data;
  });*/
	//sock.end();

}).listen(TPORT, HOST);

console.log('Server listening on ' + HOST +':'+ TPORT);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('bower_components'));

app.use('/', routes);
app.use('/users', users);

app.use('/api', router);

// Test API get test json value (http://192.168.11.33:4000/api/display/:device_id
router.get('/display/:device_id', function(req, res) {
  var id = req.params.device_id;
  console.log('ID: ', id);
  var msg = "["+id+"*0035*MESSAGE,041F044004380432043504420020043A0430043A002004340435043B0430]";
  socket.write(msg);
  res.json({
    message: msg
  });
});

router.route('/sound').get(function (req, res) {
  var id = req.params.device_id;
  connection.query('SELECT sound FROM sounds LIMIT 1', function (err, rows) {
    if (err) {
      throw err;
    } else {
      res.json({
        result: rows
      });
    }
  });
});

// Get All alarms (http://192.168.11.33:4000/api/alarms)
router.get('/alarms', function(req, res) {
   connection.query('SELECT * FROM datas', function (err, rows) {
    if (err) {
      throw err;
      res.json({
        Error: err
      });
    } else {
      res.json({
        data: rows
      });
    }
  });
});

// Get device by id API(http://192.168.111.33:4000/api/alarms/device_id)
router.route('/alarms/:device_id').get(function (req, res){
  console.log(req.params.device_id);
  var id = req.params.device_id;  
  connection.query('SELECT * FROM datas WHERE device_id=? ORDER BY date DESC LIMIT 1', id, function(err, rows){
    if (err) {
      throw err;
      res.json({
        Error: err
      });
    } else {
      res.json({
        data: rows
      });
    }
  });
});

// A number of small red flowers set instruction API(http://192.168.111.33:4000/api/flower/:device_id/:count)
router.route('/flower/:device_id/:count').post(function (req, res){
  var id = req.params.device_id;
  var count = req.params.count;
  var msg = "["+id+"*0008*FLOWER,"+count+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "OK",
      count: count
    });
  }
  socket = "";
}); 

// The shutdown instructions API(http://192.168.111.33:4000/api/poweroff/:device_id)
router.route('/poweroff/:device_id').post(function (req, res) {
    var id = req.params.device_id;
    var msg = "["+id+"*0008*POWEROFF]";
    console.log("Message: " + " : " + msg);
    console.log('Socket: ', socket);
    console.log('Status:', res.socket.statusCode);
    var socket_con = res.socket._connection;
    if (socket_con == false || socket === undefined) {
      res.json({
        statusCode: 500,
        description: 'No socket connection'
      });
    } else {
     socket.write(msg);
     res.json({
       statusCode: 200,
       description: 'PowerOFF' 
     });
    }
    socket = '';
});

// Upload the data interval is set API(http://192.168.111.33:4000/api/upload/:device_id/:count)
router.route('/uploud/:device_id/:count').post(function (req, res) {
  var id = req.params.device_id;
  var count = req.params.count;
  var msg = "["+id+"*0009*UPLOAD,"+count+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Data interval is set up",
      count: count
    });  
  }
   socket = "";
});

// Center number set up API(http://192.168.111.33:4000/api/centernumber/:device_id/:number)
router.route('/centernumber/:device_id/:number').post(function (req, res) {
  var id = req.params.device_id;
  var num = req.params.number;
  var msg = "["+id+"*0012*CENTER,"+num+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Central number is set up",
      phone: num 
    });  
  }
   socket = "";
});

// Assist center number set up API(http://192.168.111.33:4000/slavenumber/:device_id/:number)
router.route('/slavenumber/:device_id/:number').post(function (req, res) {
  var id = req.params.device_id;
  var num = req.params.number;
  var msg = "["+id+"*0011*SLAVE,"+num+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Slave number is set up",
      phone: num
    });  
  }
   socket = "";
});

// Control password set up API(http://192.168.33:4000/api/controlpw/:device_id/:password) 
router.route('/controlpw/:device_id/:password').post(function (req, res) {
  var id = req.params.device_id;
  var pasw = req.params.password;
  var msg = "["+id+"*0009*PW,"+pasw+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "New password is set up",
      password: pasw
    });  
  }
   socket = "";
});

// Outgoing calls API(http://192.168.111.33:4000/api/outcalls/:device_id:/:number)
router.route('/outcalls/:device_id/:number').post(function (req, res) {
  var id = req.params.device_id;
  var num = req.params.number;
  var msg = "["+id+"*0010*CALL,"+num+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Outgoing calls",
      phone: num
    });  
  }
   socket = "";
});

// Send text messages API(http://192.168.111.33:4000/api/send/:device_id/:number/:message)
router.route('/send/:device_id/:number/:message').post(function (req, res) {
  var id = req.params.device_id;
  var num = req.params.number;
  console.log(num);
  //var message = toHex(req.params.message);
  var msg = "["+id+"*001C*SMS,"+num+","+toHex(req.params.message)+"]";
  //console.log("Mes: ", message);
  console.log("Result msg: ", msg);
  socket.write(msg);
  res.json(msg);
});

// SOS Number set first number API(http://192.168.111.33:4000/api/setsos/:device_id/:number1)
router.route('/setsos/:device_id/:number1').post(function (req, res) {
  var id = req.params.device_id;
  var num1 = req.params.number1;
  var msg = "["+id+"*0010*SOS1,"+num1+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "First number is set up",
      phone: num
    });  
  }
   socket = "";
});

// SOS Number set second number API(http://192.168.111.33:4000/api/setsos/:device_id/:number2)
router.route('/setsos/:device_id/:number2').post(function (req, res) {
  var id = req.params.device_id;
  var num2 = req.params.number2;
  var msg = "["+id+"*0010*SOS2,"+num2+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Second number is set up",
      phone: num
    });  
  }
   socket = "";
});

// SOS Number set thrid number API(http://192.168.111.33:4000/api/setsos/:device_id/:number3)
router.route('/setsos/:device_id/:number3').post(function (req, res) {
  var id = req.params.device_id;
  var num3 = req.params.number3;
  var msg = "["+id+"*0010*SOS3,"+num3+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Thrid number is set up",
      phone: num
    });  
  }
   socket = "";
});

// SOS Number set same nymbers API(http;//192.168.111.33:4000/api/setsos/:device_id/:num1/:num2/:num3)
router.route('/setsos/:device_id/:num1/:num2/:num3').post(function (req, res) {
  var id = req.params.device_id;
  var num1 = req.params.num1;
  var num2 = req.params.num2;
  var num3 = req.params.num3;
  var msg = "["+id+"*0027*SOS,"+num1+","+num2+","+num3+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Same number is set up",
      phone1: num1,
      phone2: num2,
      phone3: num3
    });  
  }
   socket = "";
});

// IP port settings API(http://192.168.111.33:4000/api/setting/:device_id/:ip/:ports)
router.route('/setting/:device_id/:ip/:ports').post(function (req, res) {
  var id = req.params.device_id;
  var ip = req.params.ip;
  var port = req.params.ports;
  var msg = "["+id+"*0014*IP,"+ip+","+port+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      result: "IP and PORT is set up"
    });
  }
  socket = "";
});

// SOS SMS alarm switch (0:Close, 1: Open) API(http://192.168.111.33:4000/api/sossms/:device_id/:switchs)
router.route('/sossms/:device_id/:switchs').post(function (req, res) {
  var id = req.params.device_id;
  var sw = req.params.switchs;
  var msg = "["+id+"*0008*SOSSMS,"+sw+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "SOS sms is switch",
      switcher: sw
    });  
  }
   socket = "";
});

// Low battery alarm message switch (0:Close, 1: Open) API(http://192.168.111.33:4000/api/lowbattery/:device_id/:switchs)
router.route('/lowbattery/:device_id/:switchs').post(function (req, res) {
  var id = req.params.device_id;
  var sw = req.params.switchs;
  var msg = "["+id+"*0008*LOWBAT,"+sw+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Low battery alarm message is switch",
      switcher: sw
    });  
  }
   socket = "";
}); 

// Restart watch API(http://192.168.111.33:4000/api/restart/:device_id)
router.route('/restart/:device_id').post(function (req, res) {
    var id = req.params.device_id;
    var msg = "["+id+"*0005*RESET]";
    if (socket === undefined) {
      res.json({
        statusCode: 500,
        description: "No socket connection"
      });
    } else {
      socket.write(msg);
      res.json({
        statusCode: 200,
        description: "Watch is restart"
      });
    }
   socket = "";
});

// Bluetooth control instruction switch 0 - close, 1 - open API(http://192.168.111.33:4000/api/bluetooth/:device_id/:switchs)
router.route('/bluetooth/:device_id/:switchs').post(function (req, res) {
    var id = req.params.device_id;
    var sw = req.params.switchs;
    var msg = "["+id+"*0004*BT,"+sw+"]";
    if (socket === undefined) {
      res.json({
        statusCode: 500,
        description: "No socket connection"
      });
    } else {
      socket.write(msg);
      res.json({
        statusCode: 200,
        description: "Bluetooth is switch",
        switcher: sw                         
      }); 
    }
   socket = "";
});

// Set IMEI number API(http://192.168.111.33:4000/api/imei/:device_id/:number)
router.route('/imei/:device_id/:number').post(function (req, res) {
    var id = req.params.device_id;
    var num = req.params.number;
    var msg = "["+id+"*0014*IMEI,"+num+"]";
    if (socket === undefined) {
      res.json({
        statusCode: 500,
        description: "No socket connection"
      });
    } else {
      socket.write(msg);
      res.json({
        statusCode: 200,
        description: "IMEI is set up",
        imei: num
      });
    }
   socket = "";
});

// Terminal all sms switch (0: Closure, 1: Open) API(http://192.168.111.33:4000/api/sms/:device_id/:switchs)
router.route('/sms/:device_id/:switchs').post(function (req, res) {
    var id = req.params.device_id;
    var sw = req.params.switchs;
    var msg = "["+id+"*000A*SMSONOFF,"+sw+"]";
    if (socket === undefined) {
      res.json({
        statusCode: 500,
        description: "No socket connection"
      });
    } else {
      socket.write(msg);
      res.json({
        statusCode: 200,
        description: "Terminal all sms is switch",
        switcher: sw
      });
    }
   socket = "";
});

// Automatic answering control (0: Close, 1: Open) API(http://192.168.111.33:4000/api/auto_answ_control/:device_id/:switchs)
router.route('/auto_answ_control/:device_id/:switch').post(function (req, res) {
    var id = req.params.device_id;
    var sw = req.params.switchs;
    var msg = "["+id+"*0008*GSMANT,"+sw+"]";
    if (socket === undefined) {
      res.json({
        statusCode: 500,
        description: "No socket connection"
      });
    } else {
      socket.write(msg);
      res.json({
        statusCode: 200,
        description: "Automatic answering control is switch",
        switcher: sw
      });
    }
   socket = "";
});

// Check pulse API(http://192.168.111.33:4000/api/chpulse/:device_id)
router.route('/chpulse/:device_id').get(function (req, res) {
  var id = req.params.device_id;
  var msg = "["+id+"*0005*PULSE]";
  socket.write(msg);
  console.log("Result: " + " : " + res);
});

// Looking for a watch instruction API(http://192.168.111.33:4000/api/find_watch/:device_id)
router.route('/find_watch/:device_id').post(function (req, res) {
  var id = req.params.device_id;
  var msg = "["+id+"*0004*FIND]";
  socket.write(msg);
  console.log("Result: " + " : " + res);
});

// Set the terminal sms control power (0 or 1) API(http://192.168.111.33.4000/api/sms_control/:device_id/:power)
router.route('/sms_control/:device_id/:power').post(function (req, res) {
  var id = req.params.device_id;
  var pw = req.params.power;
  var msg = "["+id+"*0004*PEDO,"+pw+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: "Terminal sms control is power",
      power_status: pw
    });
  }
  socket = "";
});

// Set the language and time zone API(http://192.168.111.33.4000/api/setting/:device_id/:language/:timezone)
router.route('/setting/:device_id/:lang/:timezone').post(function (req, res){
  var id = req.params.device_id;
  var lang = req.params.language;
  var timeZone = req.params.timezone;
  var msg = "["+id+"*0006*LZ, "+lang+", "+timeZone+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: "No socket connection"
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'TimeZone and language is set up',
      timezone: timeZone,
      language: lang
    });
  }
  socket = '';
});

// Restore factory settings API(http://192.168.111.33:4000/api/factory/:device_id)
router.route('/factory/:device_id').post(function (req, res){
  var id = req.params.device_id;
  var msg = "["+id+"*0007*FACTORY]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'Factory is restore'
    });
  }
  socket = '';
});

// Positioning instruction API(http://192.168.111.33:4000/api/pi/:device_id)
router.route('/pi/:device_id').post(function (req, res) {
  var id = req.params.device_id;
  var msg = "["+id+"*0002*CR]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'Terminal GPS module is wake up'
    });
  }

  socket = '';
});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function myFunction(d) {
  return (+d).toString(16);
}

function checkLanguage(str) {
  var s = [];
  for (var i = 0; i < str.length; i++) {
    var matchedPosition = str[i].search(/[a-zA-Z]/i);
    if(matchedPosition == 0) {
      console.log('------');
      s[i] = '0' + toHex(str[i]);
      console.log(s[i]);
    } else {
      s[i] = toHex(str[i]);
    }
  }
  console.log('Output: ', s);
  var s1 = s.join('');
  return s1;
}

// Phrases Display set instruction API(http://192.168.111.33:4000/api/display/:device_id/:message)
router.route('/display/:device_id/:message').post(function (req, res) {
  var id = req.params.device_id;
  var mes = req.params.message;
  var result = checkLanguage(mes);
  console.log('Result: ', result);
  result = replaceAll(result, '020', '0020');
  var len = result.length + 8;
  console.log('Hard Len: ', len);
  len = myFunction(len);
  console.log('Len: ', len);
  var m = result.toUpperCase();
  console.log('Mes: ', m);
  var msg = "["+id+"*00"+len+"*MESSAGE,"+m+"]";
  console.log('Message to send: ', msg);
  socket.write(msg);
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    res.json({
      message: msg
    });
  }
  socket = '';
});

// White list set command API(http://192.168.111.33:4000/api/list/:device_id/:num1/:num2/:num3/:num4/:num5)
router.route('/list/:device_id/:num1/:num2/:num3/:num4/:num5').post(function (req, res) {
  var id = req.params.device_id;
  var number_1 = req.params.num1;
  var number_2 = req.params.num2;
  var number_3 = req.params.num3;
  var number_4 = req.params.num4;
  var number_5 = req.params.num5;
  var msg = "["+id+"*002D*WHITELIST1,"+number_1+","+number_2+","+number_3+","+number_4+","+number_5+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'White list is set up',
      number1: number_1,
      number2: number_2,
      number3: number_3,
      number4: number_4,
      number5: number_5
    });
  }
  socket = '';
});

// No disturbance time section set API(http://192.168.111.33:4000/api/setting/:device_id/:tsfrom1/:tsto1/:tsfrom2/:tsto2/:tsfrom3:/:tsto3/:tsfrom4/:tsto4)
router.route('/setting/:device_id/:tsfrom1/:tsto1/:tsfrom2/:tsto2/:tsfrom3:/:tsto3/:tsfrom4/:tsto4').post(function (req, res){
  var id = req.params.device_id;
  var timesectionFrom_1 = req.params.tsfrom1;
  var timesectionTo_1 = req.params.tsto1;
  var timesectionFrom_2 = req.params.tsfrom2;
  var timesectionTo_2 = req.params.tsto2;
  var timesectionFrom_3 = req.params.tsfrom3;
  var timesectionTo_3 = req.params.tsto3;
  var timesectionFrom_4 = req.params.tsfrom4;
  var timesectionTo_4 = req.params.tsto4;
  var msg = "["+id+"*0037*SILENCETIME,"+timesectionFrom_1+"-"+timesectionTo_1+","+timesectionFrom_2+"-"+timesectionTo_2+","+timesectionFrom_3+"-"+timesectionTo_3+","+timesectionFrom_4+"-"+timesectionTo_4+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'No disturbance time section set up'
    });
  }
  socket = '';
});

// Sleep and rollver time detection settings API(http://192.168.111.33:4000/api/setting/:device_id/:sleeptimefrom/:sleeptimeto)
router.route('/setting/:device_id/:sleeptimefrom/sleeptimeto').post(function (req, res) {
  var id = req.params.device_id;
  var sleepTimeFrom = req.params.sleeptimefrom;
  var sleepTimeTo = req.params.sleeptimeto;
  var msg = "["+id+"*0014*SLEEPTIME,"+sleepTimeFrom+"-"+sleepTimeTo+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'Sleep and time is set up'
    });
  }
  socket = '';
});

// Walk time settings API(http://192.168.111.33:4000/api/setting/:device_id/:walktimefrom1/:walktimeto1/:walktimefrom2/:walktimeto2/:walktimefrom3/:walktimeto3)
router.route('/setting/:device_id/:walktimefrom1/:walktimeto1/:walktimefrom2/:walktimeto2/:walktimefrom3/:walktimeto3').post(function (req, res) {
  var id = req.params.device_id;
  var wtFrom1 = req.params.walktimefrom1;
  var wtTo1 = req.params.walktimeto1;
  var wtFrom2 = req.params.walktimefrom2;
  var wtTo2 = req.params.walktimeto2;
  var wtFrom3 = req.params.walktimefrom3;
  var wtTo3 = req.params.walktimeto3;
  var msg = "["+id+"*002A*WALKTIME,"+wtFrom1+"-"+wtTo1+","+wtFrom2+"-"+wtTo2+","+wtFrom3+"-"+wtTo3+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'Walk time is set up'
    });
  }
  socket = '';
});

// Set the working time API(http://192.168.111.33:4000/api/setting/:device_id/:worktime)
router.route('/setting/:device_id/:worktime').post(function (req, res) {
  var id = req.params.device_id;
  var wt = req.params.worktime;
  var msg = "["+id+"*000A*WORKTIME,"+wt+"]";
  if (socket === undefined) {
    res.json({
      statusCode: 500,
      description: 'No socket connection'
    });
  } else {
    socket.write(msg);
    res.json({
      statusCode: 200,
      description: 'Working time is set up'
    });
  }
  socket = '';
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function toHex(str) {
  var result = '';
  for (var i=0; i<str.length; i++) {
    result += '0' + str.charCodeAt(i).toString(16);
  }
  return result;
}

app.timeout = 6000;
app.listen(4000);
module.exports = app;
