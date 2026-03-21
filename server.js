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

            // 👉 Extract IMEI (approx)
            const imeiHex = hex.substring(8, 24);
            const imei = parseInt(imeiHex, 16).toString();
            console.log("IMEI:", imei);

            socket.imei = imei; // store in socket

            // 👉 Send ACK
            const response = Buffer.from("787805010001d9dc0d0a", "hex");
            socket.write(response);
            console.log("✅ Login ACK Sent");
            return;
        }

        // ================= HEARTBEAT PACKET =================
        if (hex.startsWith("78780a13")) {
            console.log("💓 Heartbeat Packet");

            const response = Buffer.from("787805130001d9dc0d0a", "hex");
            socket.write(response);
            console.log("✅ Heartbeat ACK Sent");
            return;
        }

        // ================= GPS DATA PACKET =================
        if (hex.startsWith("787822")) {
            console.log("📍 GPS Packet Received");

            try {
                const buffer = data;

                // 👉 Correct parsing using buffer
                const lat = buffer.readUInt32BE(11) / 1800000;
                const lon = buffer.readUInt32BE(15) / 1800000;
                const speed = buffer.readUInt8(19);

                const imei = socket.imei || "unknown";

                console.log("✅ Parsed:", { imei, lat, lon, speed });

                // 👉 Store data
                latestData[imei] = {
                    imei,
                    lat,
                    lon,
                    speed,
                    time: new Date()
                };

            } catch (err) {
                console.log("❌ Parsing Error:", err.message);
            }
            return;
        }

        console.log("⚠️ Unknown Packet");
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