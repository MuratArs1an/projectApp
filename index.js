const express=require('express');
const postgresClient=require('./config/database');
const app=express(); 
const routes=require('./routes/routes');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization'
})); 
app.use(express.json());
app.use('/',routes);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    postgresClient.connect(err=>{
        if(err){
            console.log('connection error', err.stack);
        }else{
            console.log('db connection successful');
        }
    })
});