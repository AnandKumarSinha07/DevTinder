const cron = require('node-cron');
const {subDays}=require('date-fns')

cron.schedule("0 8 * * *",()=>{
   try{

      const yesterday=subDays(new Date(),1);
   }
   catch(err){
    console.log("Error insdie the cron job",err);
   }
})