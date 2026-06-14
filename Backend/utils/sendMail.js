const  nodemailer = require('nodemailer')

exports.sendMaiil = async (to , subject , text )=>{
   try {
       const transportser = nodemailer.createTransport({
        service:"Gmail",
        auth:{
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS
        }
       })
       await transportser.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        text
       })
   } catch (error) {
    console.log("error in sending mail",error)
   } 
}