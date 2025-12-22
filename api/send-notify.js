const admin = require('firebase-admin');

module.exports = async (req, res) => {
    // 🟢 1. จัดการ CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 🟢 2. จัดเตรียม Private Key ให้สะอาด 100%
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';

    // ขั้นตอนการทำความสะอาดกุญแจเพื่อแก้ Error Bit Supported
    const formattedKey = rawKey
        .replace(/^"|"$/g, '')          // ลบเครื่องหมายคำพูดครอบหัวท้าย (ถ้ามี)
        .replace(/\\n/g, '\n')          // เปลี่ยนตัวอักษร \n ให้เป็นการขึ้นบรรทัดใหม่จริง
        .trim();                        // ลบช่องว่างหรือบรรทัดว่างส่วนเกิน

    // 🟢 3. Initialize Firebase Admin
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "kc-tobe-friendcorner-21655",
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: formattedKey,
                }),
            });
            console.log("✅ Firebase Admin Initialized");
        } catch (e) {
            console.error("❌ Init Error:", e.message);
            return res.status(500).json({ success: false, error: "Init failed: " + e.message });
        }
    }

    // 🟢 4. ส่วนส่งข้อความ
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