const admin = require('firebase-admin');

module.exports = async (req, res) => {
    // 1. จัดการ CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // 2. ตรวจสอบและเตรียม Private Key
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) {
        return res.status(500).json({ error: "Missing FIREBASE_PRIVATE_KEY" });
    }

    // จัดการเรื่องขึ้นบรรทัดใหม่ให้ถูกต้องสำหรับ RSA Key
    // ใช้คำสั่งนี้เพื่อเปลี่ยน \n (ตัวอักษร) ให้เป็น newline (จริง)
    const formattedKey = privateKey.replace(/\\n/g, '\n');

    // 3. Initialize Firebase Admin
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "kc-tobe-friendcorner-21655",
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: formattedKey,
                }),
            });
            console.log("✅ Firebase Initialized");
        } catch (e) {
            console.error("❌ Init Error:", e.message);
            return res.status(500).json({ error: "Init Error: " + e.message });
        }
    }

    // 4. ส่งข้อความ
    const { token, title, body } = req.body;
    if (!token || !title || !body) return res.status(400).json({ error: 'Missing data' });

    try {
        const response = await admin.messaging().send({
            notification: { title, body },
            token: token,
            data: { url: "https://2bkc-baojai-zone.vercel.app/" }
        });
        return res.status(200).json({ success: true, messageId: response });
    } catch (error) {
        console.error('FCM Error:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};