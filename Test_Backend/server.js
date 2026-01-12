const express = require("express");
const bookingsRouter = require('./routes/Booking');
const componentsRouter=require('./routes/Components');
const route2 = require("./routes/Components");
const app = express();

app.use(express.json());
app.use('/bookings', bookingsRouter); 
app.use('/bookings/:id', bookingsRouter); 
app.use('/components',componentsRouter);
app.use('/components/:id',componentsRouter);


app.get("/",(req,res)=>{
    res.send("Hello");
});

app.listen(3000,(req,res)=>{
    console.log("server is running");
});