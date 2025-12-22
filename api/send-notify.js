const admin = require('firebase-admin');

module.exports = async (req, res) => {
    // 🟢 1. จัดการเรื่อง CORS (ให้ครอบคลุมการเรียกจากหน้าเว็บ)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // ตอบกลับ Preflight Request ทันที
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 🟢 2. ตรวจสอบ Method (รับเฉพาะ POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 🟢 3. Initialize Firebase Admin (แก้ไขจุด app/no-app และ Bit Error)
    if (!admin.apps.length) {
        try {
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;

            // ตรวจสอบและจัดการรูปแบบ Private Key ให้ถูกต้อง
            if (privateKey) {
                // ถ้ามีเครื่องหมายคำพูดติดมาให้ลบออก
                privateKey = privateKey.replace(/^"|"$/g, '');
                // เปลี่ยนตัวอักษร \n เป็นการขึ้นบรรทัดใหม่จริง
                if (privateKey.includes('\\n')) {
                    privateKey = privateKey.replace(/\\n/g, '\n');
                }
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    project_id: "kc-tobe-friendcorner-21655",
                    private_key: privateKey,
                    client_email: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
            console.log("✅ Firebase Admin Initialized Successfully");
        } catch (e) {
            console.error("❌ Firebase Admin Init Error:", e.message);
            return res.status(500).json({
                success: false,
                error: "Initialization failed: " + e.message
            });
        }
    }

    // 🟢 4. ตรวจสอบข้อมูลที่ส่งมา
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ error: 'Missing token, title, or body' });
    }

    // 🟢 5. ส่งการแจ้งเตือน
    try {
        const message = {
            notification: { title, body },
            token: token,
            data: {
                url: "https://2bkc-baojai-zone.vercel.app/",
                click_action: "https://2bkc-baojai-zone.vercel.app/"
            }
        };

        const response = await admin.messaging().send(message);
        console.log("🚀 Notification sent:", response);

        return res.status(200).json({
            success: true,
            messageId: response
        });

    } catch (error) {
        console.error('FCM Error:', error.message);
        return res.status(500).json({
            success: false,
            error: error.message,
            code: error.code
        });
    }
};