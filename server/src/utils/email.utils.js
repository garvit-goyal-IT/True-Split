import nodemailer from "nodemailer"


const sendEmail=async({to,subject,html})=>{
    const transporter= nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
    })

        const info=await transporter.sendMail({
            from: "True Split <trueSplit@gmail.com>",
            to: to,
            subject: subject,
            html: html
        });

        console.log("Message sent : %s",info.messageId)
}

const sendExpenseNotification= async (members, addedBy, expenseTitle, amount, groupName)=>{
    
    for(const member of members){
       await sendEmail({ 
            to : member.email, 
            html: `<p>Hello ${member} , Greetings from True Split. Your team
             member ${addedBy} has added a new Expense "${expenseTitle}" of amount 
             ${amount} in the ${groupName}</p>`,
            subject:  `New expense added in ${groupName}`
        })
    }
}

const sendMemberJoinedNotification=async(adminEmail, newMember, groupName)=>{
    await sendEmail({
        to: adminEmail,
        html:  `<p>hello admin, greetings from True Split. A new member ${newMember} 
        has joined your group ${groupName}</p>.
        `,
        subject: `New member joined in ${groupName} `
     })
}

export {sendExpenseNotification} 