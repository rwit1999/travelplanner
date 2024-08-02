import { Browser } from "puppeteer";
import { startLocationScraping } from "./scraping/location-scraping";
import { startPackageScraping } from "./scraping/package-scraping";

export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { Worker } = await import("bullmq");
    const {prisma} =await import('@/lib')
    const { jobsQueue } = await import("@/lib/queue");
    const { connection } = await import("@/lib/redis");
    const puppeteer = await import("puppeteer")
    const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_9626462d-zone-scraping_browser1:1lmggj3e27yp@brd.superproxy.io:9222'

    new Worker("jobsQueue", async (job) => {
        let browser:undefined | Browser=undefined
        try{
            //creating admin
            const admin=await prisma.admin.count()
            if(!admin){
              const data = prisma.admin.create({
                data:{
                  email:"adminJetsetgo@gmail.com",
                  password:"8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
                }
              })
            }
            //connecting to puppeteer browser
            browser = await puppeteer.connect({
                browserWSEndpoint: SBR_WS_ENDPOINT,
            });
            const page=await browser.newPage()

            console.log('Connected ! Navigating to '+job.data.url);
            await page.goto(job.data.url,{timeout:20000})
            console.log('Navigated! Scrapping page content...');

            if(job.data.jobType.type==="location"){
                const packages=await startLocationScraping(page)
                // console.log({packages});
                await prisma.jobs.update({where:{id:job.data.id},data:{isComplete:true,status:"complete"}})
                
                for(const pkg of packages){
                  const jobCreated=await prisma.jobs.findFirst({where:{
                    url:`https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`
                  }})
                  if(!jobCreated){
                    const job = await prisma.jobs.create({
                      data:{
                        url:`https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                        jobType:{type:"package"},

                      }
                    })
                    jobsQueue.add("package",{...job,packageDetails:pkg})
                  }

                }
            }
            else if(job.data.jobType.type==='package'){
                  //checking if already scraped
                  const alreadyScraped=await prisma.trips.findUnique({where:{id:job.data.packageDetails.id}})
                  // if not, then scrape 
                  if(!alreadyScraped){
                    const pkg=await startPackageScraping(page,job.data.packageDetails)
                    // console.log(pkg);
                    
                    await prisma.trips.create({data:pkg})
                    await prisma.jobs.update({where:{id:job.data.id},data:{isComplete:true,status:"complete"}})
                  }
                  
            }
        }
        catch(error){
            console.log(error);
            await prisma.jobs.update({where:{id:job.data.id},data:{isComplete:true,status:"failed"}})
            
        }finally{
            await browser?.close()
            console.log("broswer closed successfully");
        }
        
    }, {
      connection,
      concurrency: 10,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });
  }
};
