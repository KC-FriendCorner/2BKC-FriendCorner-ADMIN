const admin = require('firebase-admin');

// ดึงค่าจาก Environment Variables พร้อมระบบป้องกัน Error
const serviceAccount = {
    "type": "service_account",
    "project_id": "kc-tobe-friendcorner-21655",
    "private_key_id": "155d3f45fc7f5e73bf1b58942e713d958f0639e0",
    // ตรวจสอบว่ามีค่าใน Vercel หรือไม่ ถ้ามีให้จัดการเรื่องขึ้นบรรทัดใหม่และตัดช่องว่างทิ้ง
    "private_key": process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim()
        : undefined,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": "100289366814873107854",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    // สร้าง URL อัตโนมัติจาก Client Email
    "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || "")}`,
    "universe_domain": "googleapis.com"
};

// ตรวจสอบความพร้อมของข้อมูลก่อนรัน App
if (!serviceAccount.private_key || !serviceAccount.client_email) {
    console.error("❌ Critical Error: Missing Environment Variables in Vercel Settings!");
}

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (e) {
        console.error("❌ Firebase Admin Init Error:", e.message);
    }
}

module.exports = async (req, res) => {
    // 🟢 1. จัดการเรื่อง CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 🟢 2. ตอบกลับ Preflight Request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 🟢 3. ตรวจสอบ Method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 🟢 4. ตรวจสอบ Environment Variables ก่อนประมวลผล
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
        return res.status(500).json({
            success: false,
            error: "Server configuration missing (Environment Variables not found)"
        });
    }

    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ error: 'Missing token, title, or body' });
    }

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
        res.status(200).json({ success: true, messageId: response });

    } catch (error) {
        console.error('FCM Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code
        });
    }
};