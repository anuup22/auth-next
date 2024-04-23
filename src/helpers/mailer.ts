import User from '@/models/user.model';
import nodemailer from 'nodemailer';
import bcryptjs from "bcryptjs"

export const sendEmail = async ({email, emailType, userId}: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        }
        else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }
        /*
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "maddison53@ethereal.email", 
              pass: "jn7jnAPss4f63QBp6D", 
            },
        });
        */
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "aec873b625cd73", // ❌
              pass: "377af28c4779d2" // ❌
            }
        });

        const mailOptions = {
            from: 'anuup22@next.in', // sender address
            to: email, // list of receivers
            subject: (emailType === "VERIFY")? "Verify your Email": "Reset your Password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // TODO: write html body for reset password later
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    }
    catch (error: any) {
        throw new Error(error.message);
    }
};