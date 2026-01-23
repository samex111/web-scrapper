import express from "express";

const PORT = process.env.PORT || 3000;

const app  = express();
app.use(express.json());

app.get("/health", (req,res)=>{
    res.status(200).json({
        msg:"backend is running"
    })
})

app.use('/api/v1/scrape' , middleware, scrapeRoute);
app.use('/api/v1/lead' , middleware, leadsRoute);

app.listen(PORT, ()=>{
    console.log("server is listening on port: "+ PORT)
})