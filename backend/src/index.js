import experss from 'express'
import dotenv from 'dotenv'

const app = experss();

dotenv.config();
console.log(process.env.PORT);

app.use(experss.json());

app.get('/',(req,res)=>{
    res.send("working proerly");
})

app.listen(process.env.PORT,()=>[
    console.log(`listning on port : ${process.env.PORT}`)
])

