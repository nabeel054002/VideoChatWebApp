const app = require("express")();
const cors = require("cors");
const server = require("http").createServer(app);//http is a built in node module 
const io = require("socket.io")(server, {
    cors: {
        origin: "GET",
        method: ["GET", "POST"]
    }
});
app.use(cors());

const PORT = process.env.PORT || 5000

app.get("/", (req, res)=>{
    res.send("Server is running")
})

io.on('connection', (socket)=>{
    socket.emit('me', socket.id);
    socket.on('disconnect', ()=>{
        socket.broadcast.emit("callended")//DOES THE WORD ENTERED IN THE *.emit() AS INPUT REALLY MEAN SOMETHING FIXED
    })
    socket.on("calluser", ([userToCall, signalData, from, name])=>{
        io.to(userToCall).emit("calluser", {
            signal: signalData,
            from,
            name
        })
    })
    socket.on("answercall", (data)=>{
        io.to(data.to).emit("callaccepted", data.signal);
    })
})

app.listen(PORT, ()=>{
    console.log("Server listening at", PORT)
})