const express = require("express");
const net = require("net");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 2000;

// 👉 Store latest GPS data (temporary)
let latestData = {};

// ================== TCP SERVER (PORT 5000) ==================
const tcpServer = net.createServer((socket) => {
    console.log("✅ Device Connected:", socket.remoteAddress);


    socket.on("data", (data) => {
        console.log("📡 RAW DATA:", data); // 👈 important
        const msg = data.toString();
        console.log("TCP DATA:", msg);

        // 👉 Simple parsing (change based on your device format)
        const imei = msg.match(/imei:(\d+)/)?.[1];
        const lat = msg.match(/lat:(\d+\.\d+)/)?.[1];
        const lon = msg.match(/lon:(\d+\.\d+)/)?.[1];

        if (imei) {
            latestData[imei] = {
                imei,
                lat,
                lon,
                time: new Date()
            };
        }
    });

    socket.on("end", () => {
        console.log("Device Disconnected");
    });
});

tcpServer.listen(6000, () => {
    console.log("TCP Server running on port 6000");
});

// ================== API (PORT 2000) ==================

app.get("/", (req, res) => {
    res.send("Server Is working Now")
})

// 👉 Get all devices
app.get("/devices", (req, res) => {
    res.json(latestData);
});

// 👉 Get single device
app.get("/device/:imei", (req, res) => {
    const data = latestData[req.params.imei];
    res.json(data || { message: "No data found" });
});

app.listen(PORT, () => {
    console.log(`HTTP Server Running On Port: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});