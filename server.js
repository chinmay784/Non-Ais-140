// const express = require("express");
// const net = require("net");

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 2000;

// // 👉 Store latest GPS data
// let latestData = {};

// // ================== TCP SERVER (PORT 6000) ==================
// const tcpServer = net.createServer((socket) => {
//     console.log("✅ Device Connected:", socket.remoteAddress);

//     socket.on("data", (data) => {
//         const hex = data.toString("hex");
//         console.log("📡 HEX:", hex);

//         // ================= LOGIN PACKET =================
//         if (hex.startsWith("78781101")) {
//             console.log("🔐 Login Packet Received");

//             // 👉 Extract IMEI (approx)
//             const imeiHex = hex.substring(8, 24);
//             const imei = parseInt(imeiHex, 16).toString();
//             console.log("IMEI:", imei);

//             socket.imei = imei; // store in socket

//             // 👉 Send ACK
//             const response = Buffer.from("787805010001d9dc0d0a", "hex");
//             socket.write(response);
//             console.log("✅ Login ACK Sent");
//             return;
//         }

//         // ================= HEARTBEAT PACKET =================
//         if (hex.startsWith("78780a13")) {
//             console.log("💓 Heartbeat Packet");

//             const response = Buffer.from("787805130001d9dc0d0a", "hex");
//             socket.write(response);
//             console.log("✅ Heartbeat ACK Sent");
//             return;
//         }

//         // ================= GPS DATA PACKET =================
//         if (hex.startsWith("787822")) {
//             console.log("📍 GPS Packet Received");

//             try {
//                 const buffer = data;

//                 // 👉 Correct parsing using buffer
//                 const lat = buffer.readUInt32BE(11) / 1800000;
//                 const lon = buffer.readUInt32BE(15) / 1800000;
//                 const speed = buffer.readUInt8(19);

//                 const imei = socket.imei || "unknown";

//                 console.log("✅ Parsed:", { imei, lat, lon, speed });

//                 // 👉 Store data
//                 latestData[imei] = {
//                     imei,
//                     lat,
//                     lon,
//                     speed,
//                     time: new Date()
//                 };

//             } catch (err) {
//                 console.log("❌ Parsing Error:", err.message);
//             }
//             return;
//         }

//         console.log("⚠️ Unknown Packet");
//     });

//     socket.on("end", () => {
//         console.log("❌ Device Disconnected");
//     });

//     socket.on("error", (err) => {
//         console.log("❌ Socket Error:", err.message);
//     });
// });

// tcpServer.listen(6000, () => {
//     console.log("🚀 TCP Server running on port 6000");
// });

// // ================== API (PORT 2000) ==================

// app.get("/", (req, res) => {
//     res.send("Server Is Working Now ✅");
// });

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
//     console.log(`🌐 HTTP Server Running On Port: ${PORT}`);
//     console.log(`👉 http://localhost:${PORT}`);
// });






// const express = require("express");
// const net = require("net");

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 2000;

// // 👉 Store latest GPS data
// let latestData = {};

// // ================== TCP SERVER (PORT 6000) ==================
// const tcpServer = net.createServer((socket) => {
//     console.log("✅ Device Connected:", socket.remoteAddress);

//     socket.on("data", (data) => {
//         const hex = data.toString("hex");
//         console.log("📡 HEX:", hex);

//         // ================= 7979 PACKET (IMEI FIX) =================
//         if (hex.startsWith("7979")) {
//             console.log("📦 7979 Packet Received");

//             try {
//                 const imeiBuffer = data.slice(7, 15);
//                 const imei = imeiBuffer.toString("hex").replace(/^0+/, "");

//                 console.log("✅ IMEI (7979):", imei);

//                 socket.imei = imei;

//             } catch (err) {
//                 console.log("❌ 7979 Parse Error:", err.message);
//             }
//             return;
//         }

//         // ================= LOGIN PACKET =================
//         if (hex.startsWith("78781101")) {
//             console.log("🔐 Login Packet Received");

//             const imeiHex = hex.substring(8, 24);
//             const imei = parseInt(imeiHex, 16).toString();

//             console.log("IMEI:", imei);
//             socket.imei = imei;

//             const response = Buffer.from("787805010001d9dc0d0a", "hex");
//             socket.write(response);
//             console.log("✅ Login ACK Sent");
//             return;
//         }

//         // ================= HEARTBEAT =================
//         if (hex.startsWith("78780a13")) {
//             console.log("💓 Heartbeat Packet");

//             const response = Buffer.from("787805130001d9dc0d0a", "hex");
//             socket.write(response);

//             console.log("✅ Heartbeat ACK Sent");
//             return;
//         }

//         // ================= GPS DATA =================
//         if (hex.startsWith("787822")) {
//             console.log("📍 GPS Packet Received");

//             try {
//                 const buffer = data;

//                 const lat = buffer.readUInt32BE(11) / 1800000;
//                 const lon = buffer.readUInt32BE(15) / 1800000;
//                 const speed = buffer.readUInt8(19);

//                 const imei = socket.imei || "unknown";

//                 console.log("✅ Parsed:", { imei, lat, lon, speed });

//                 latestData[imei] = {
//                     imei,
//                     lat,
//                     lon,
//                     speed,
//                     time: new Date()
//                 };

//             } catch (err) {
//                 console.log("❌ Parsing Error:", err.message);
//             }
//             return;
//         }

//         console.log("⚠️ Unknown Packet");
//     });

//     socket.on("end", () => {
//         console.log("❌ Device Disconnected");
//     });

//     socket.on("error", (err) => {
//         console.log("❌ Socket Error:", err.message);
//     });
// });

// tcpServer.listen(6000, () => {
//     console.log("🚀 TCP Server running on port 6000");
// });

// // ================== API (PORT 2000) ==================

// app.get("/", (req, res) => {
//     res.send("Server Is Working Now ✅");
// });

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
//     console.log(`🌐 HTTP Server Running On Port: ${PORT}`);
//     console.log(`👉 http://localhost:${PORT}`);
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

        // ================= 7979 PACKET (FIXED IMEI) =================
        if (hex.startsWith("7979")) {
            console.log("📦 7979 Packet Received");

            try {
                const imeiBuffer = data.slice(7, 15);
                let imeiHex = imeiBuffer.toString("hex");

                // 👉 FIX BCD (remove first nibble)
                let imei = imeiHex.substring(1);

                // 👉 Ensure 15 digits
                imei = imei.substring(0, 15);

                console.log("✅ Correct IMEI (7979):", imei);

                socket.imei = imei;

            } catch (err) {
                console.log("❌ 7979 Parse Error:", err.message);
            }
            return;
        }

        // ================= LOGIN PACKET (FIXED IMEI) =================
        if (hex.startsWith("78781101")) {
            console.log("🔐 Login Packet Received");

            try {
                const imeiHex = hex.substring(8, 24);

                // 👉 FIX BCD
                let imei = imeiHex.substring(1);
                imei = imei.substring(0, 15);

                console.log("✅ Correct IMEI (LOGIN):", imei);

                socket.imei = imei;

                // 👉 Send ACK
                const response = Buffer.from("787805010001d9dc0d0a", "hex");
                socket.write(response);
                console.log("✅ Login ACK Sent");

            } catch (err) {
                console.log("❌ Login Parse Error:", err.message);
            }
            return;
        }

        // ================= HEARTBEAT =================
        if (hex.startsWith("78780a13")) {
            console.log("💓 Heartbeat Packet");

            const response = Buffer.from("787805130001d9dc0d0a", "hex");
            socket.write(response);

            console.log("✅ Heartbeat ACK Sent");
            return;
        }

        // ================= GPS DATA =================
        if (hex.startsWith("787822")) {
            console.log("📍 GPS Packet Received");

            try {
                const buffer = data;

                const lat = buffer.readUInt32BE(11) / 1800000;
                const lon = buffer.readUInt32BE(15) / 1800000;
                const speed = buffer.readUInt8(19);

                const imei = socket.imei || "unknown";

                console.log(latestData)
                console.log("✅ Parsed:", { imei, lat, lon, speed });

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