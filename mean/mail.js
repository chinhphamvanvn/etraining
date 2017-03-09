var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    auth: {
        user: 'contact@vietinterview.com',
        pass: 'Tc!@#6102'
      },
      port: 25,
      host: 'vietinterview.com',
      secure:false,
      tls: {rejectUnauthorized: false},
      ignoreTLS:false,
      debug:true
})




transporter.sendMail({
    from: 'contact@vietinterview.com',
    to: 'technicalmanager@gmail.com',
    subject: 'hello world!',
    text: 'Authenticated with VietInterview'
}, function(error, response) {
   if (error) {
        console.log(error);
   } else {
        console.log('Message sent');
   }
});    