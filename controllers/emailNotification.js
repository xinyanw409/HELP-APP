const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'helpactivitygroup@gmail.com',
        pass: 'fseemail'
    }
});

var generateEmailContent = (activity, username) => {
    var greeting = "Hello " + username + ",";
    var firstPara = "This is a friendly reminder that you registered " + activity.title + ": ";
    var secondPara = activity.description;
    var thirdPara = "Date and Time: " + activity.startDate;
    var fourthPara = "Location: " + activity.location;
    var fifthPara = "We look forward to seeing you at the activity!"
    var inscription = "Sincerely,\nHelp Activity Team"
    var content = [greeting, firstPara, secondPara, 
        thirdPara, fourthPara, fifthPara, inscription].join("\n\n");
    return content;

}


var sendEmail = (email, content, title) => {
    const mailOptions = {
        from: 'helpactivitygroup@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Welcome to ' + title, // Subject line
        text: content// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
       if(err)
         console.log(err)
       else
         console.log(info);
    });
}

module.exports = {
    generateEmailContent,
    sendEmail,
}