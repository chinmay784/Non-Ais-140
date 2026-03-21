// const express = require("express");
// const net = require("net");

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 2000;

// // 👉 Store latest GPS data (temporary)
// let latestData = {};

// // ================== TCP SERVER (PORT 5000) ==================
// const tcpServer = net.createServer((socket) => {
//     console.log("✅ Device Connected:", socket.remoteAddress);


//     socket.on("data", (data) => {
//         console.log("📡 RAW DATA:", data); // 👈 important
//         const msg = data.toString();
//         console.log("TCP DATA:", msg);

//         // 👉 Simple parsing (change based on your device format)
//         const imei = msg.match(/imei:(\d+)/)?.[1];
//         const lat = msg.match(/lat:(\d+\.\d+)/)?.[1];
//         const lon = msg.match(/lon:(\d+\.\d+)/)?.[1];

//         if (imei) {
//             latestData[imei] = {
//                 imei,
//                 lat,
//                 lon,
//                 time: new Date()
//             };
//         }
//     });

//     socket.on("end", () => {
//         console.log("Device Disconnected");
//     });
// });

// tcpServer.listen(6000, () => {
//     console.log("TCP Server running on port 6000");
// });

// // ================== API (PORT 2000) ==================

// app.get("/", (req, res) => {
//     res.send("Server Is working Now")
// })

// // 👉 Get all devices
// app.get("/devices", (req, res) => {
//     res.json(latestData);
// });

// // 👉 Get single device
// app.get("/device/:imei", (req, res) => {
//     const data = latestData[req.params.imei];
//     res.json(data || { message: "No data found" });
// });

// app.listen(PORT, () => {
//     console.log(`HTTP Server Running On Port: ${PORT}`);
//     console.log(`URL: http://localhost:${PORT}`);
// });








const express = require("express");
const net = require("net");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 2000;

// 👉 Store latest GPS data
let latestData = {};

// ================== TCP SERVER (PORT 6000) ==================
const tcpServer = net.createServer((socket) => {
    console.log("✅ Device Connected:", socket.remoteAddress);

    socket.on("data", (data) => {
        const hex = data.toString("hex");
        console.log("📡 HEX:", hex);

        // ================= LOGIN PACKET =================
        if (hex.startsWith("78781101")) {
            console.log("🔐 Login Packet Received");

            // 👉 Extract IMEI (optional)
            const imeiHex = hex.substring(8, 24);
            const imei = parseInt(imeiHex, 16).toString();
            console.log("IMEI:", imei);

            // 👉 Send ACK (VERY IMPORTANT)
            const response = Buffer.from("787805010001d9dc0d0a", "hex");
            socket.write(response);
            console.log("✅ Login ACK Sent");

            return;
        }

        // ================= GPS DATA PACKET =================
        if (hex.includes("12")) {
            console.log("📍 GPS Packet Received");

            try {
                // 👉 Extract LAT/LON (GT06 basic parsing)
                const latHex = hex.substring(22, 30);
                const lonHex = hex.substring(30, 38);

                const lat = parseInt(latHex, 16) / 1800000;
                const lon = parseInt(lonHex, 16) / 1800000;

                console.log("Parsed:", { lat, lon });

                // 👉 Store data
                latestData["device1"] = {
                    imei: "device1",
                    lat,
                    lon,
                    time: new Date()
                };

            } catch (err) {
                console.log("❌ Parsing Error:", err.message);
            }
        }
    });

    socket.on("end", () => {
        console.log("❌ Device Disconnected");
    });

    socket.on("error", (err) => {
        console.log("❌ Socket Error:", err.message);
    });
});

tcpServer.listen(6000, () => {
    console.log("🚀 TCP Server running on port 6000");
});

// ================== API (PORT 2000) ==================

app.get("/", (req, res) => {
    res.send("Server Is Working Now ✅");
});

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
    console.log(`🌐 HTTP Server Running On Port: ${PORT}`);
    console.log(`👉 http://localhost:${PORT}`);
});