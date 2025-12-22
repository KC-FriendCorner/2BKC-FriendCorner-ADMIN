const admin = require('firebase-admin');

module.exports = async (req, res) => {
    // 1. CORS & Methods
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Initialize Firebase (ใช้โครงสร้างที่รองรับ Multiline Key)
    if (!admin.apps.length) {
        try {
            const pKey = process.env.FIREBASE_PRIVATE_KEY 
                ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
                : undefined;

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "kc-tobe-friendcorner-21655",
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: pKey,
                }),
            });
            console.log("✅ Firebase Initialized with New Key");
        } catch (e) {
            return res.status(500).json({ success: false, error: "Init error: " + e.message });
        }
    }

    // 3. Send Notification
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