const admin = require('firebase-admin');

// 🚩 ตรวจสอบให้แน่ใจว่าได้ใส่ private_key ตัวเต็มที่มีเครื่องหมาย \n ครบถ้วน
const serviceAccount = {
    "type": "service_account",
    "project_id": "kc-tobe-friendcorner-21655",
    "private_key_id": "155d3f45fc7f5e73bf1b58942e713d958f0639e0",
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": "100289366814873107854",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kc-tobe-friendcorner-21655.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = async (req, res) => {
    // 🟢 1. จัดการเรื่อง CORS (อนุญาตให้ Browser ยิงข้าม Domain ได้)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // ในอนาคตควรระบุเฉพาะ URL ของคุณเพื่อความปลอดภัย
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 🟢 2. ตอบกลับ Preflight Request (OPTIONS) ทันที
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 🟢 3. ตรวจสอบ Method ต้องเป็น POST เท่านั้น
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { token, title, body } = req.body;

    // ตรวจสอบว่ามีข้อมูลส่งมาครบไหม
    if (!token || !title || !body) {
        return res.status(400).json({ error: 'Missing token, title, or body' });
    }

    try {
        const message = {
            notification: { title, body },
            token: token,
            data: {
                url: "https://2bkc-baojai-zone.vercel.app/",
                click_action: "https://2bkc-baojai-zone.vercel.app/" // สำหรับ Android/Web
            }
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        res.status(200).json({ success: true, messageId: response });

    } catch (error) {
        console.error('FCM Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code
        });
    }
}