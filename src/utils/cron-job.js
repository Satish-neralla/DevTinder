const cron = require("node-cron");
const connectionRequestModel = require("../model/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule('51 19 * * *', async () => {
  try{
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequestModel.find({
        status : "interested"
    }).populate("fromUserId toUserId");

    const toEmailsList = [...new Set(pendingRequests.map(req => req.toUserId.email))];
    console.log(toEmailsList);
    const body = `Hi, <br/> There are some pending request connections. Login to portal and take action.`

    for(const email of toEmailsList){
        const res = await sendEmail.run("Pending Request notification", body);
        console.log(res);
    }
  }
  catch(e){
    console.log(e);
  }
});