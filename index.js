const express=require('express')
const userRouter=require('./routes/userRouter')
const connectDb=require('./db')
const dotEnv=require('dotenv')
const app=express()
const port=8080
dotEnv.config()

app.use(express.json())
app.use('/test',userRouter)

connectDb()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server Running At http://localhost${port}`)
    })
}).catch((error)=>{
    console.log('Error While Connecting Db',error)
})
