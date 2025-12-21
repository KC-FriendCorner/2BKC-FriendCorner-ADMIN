const admin = require('firebase-admin');

// 🚩 ตรวจสอบให้แน่ใจว่าได้ใส่ private_key ตัวเต็มที่มีเครื่องหมาย \n ครบถ้วน
const serviceAccount = {
    "type": "service_account",
    "project_id": "kc-tobe-friendcorner-21655",
    "private_key_id": "bce9e7bc6358e9ab2611512a42d221cc37ca5895",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6+hmihEhZZYww\n34e3P90eBEbTbsfMktTcmUlDEt5gQWMHRnhTf9Y1zWgzBo4hz2OEwiifZGTI7uQ7\nEIWL38PDx9yvkwkx6X02BOXdGCfTjnU8MjqirMjRAkZxA90F7MhS9VIQP9Sy/QFS\n6B/MAMKiFyylTbX6C6vsyq/3rRxclHBVTlGY6SgWeHAYMpzWSXqCv9J+DzmhibWh\nt7CiRsd/YJAuQfl9giUTHgDZWn+5ttw8OHuAkXmiJK48QV2T4Hzu7bEM7fRABXPP\nHIhFy6RvzZgvJLqPrMdun3xhwR1Fvq9bdc+vs9/y+q4/2lrff0BHsrDgLqDiGYzP\n+PavrvvrAgMBAAECggEAD1A/fDt4T3YNKs2L6Hq/Cd/Qyy1GCN+3tk+JnAg2FU0V\nprljTndoXGSz1YYCawt4u51JRXCr/nbuU1YRkfikKGs8jFavCJr2ac+x4c9CJ8YB\nnQoCGmOrWM7mZQgreHpBl+XGsFUB/xzQmHExdXxUdIEQY4N/VXjSPmUFT3Qqn/xW\nIWkYO9tnp87IyrgEZtMjALkRcC4tqAAASLTRad96bm2ywhfnMAxr1Vii0V1cY5iu\nOSIpb+0tfipJQO9DmDFBT2ezV3QamxH5IrxmHOvhRpu0mkikL+ccjLoBQO+ECBUc\niXpp6Fs8hDY+FCGkqlFi9PFDx/JsO55KajccTI8yPQKBgQD6sRXgJVuS8xAy0vx6\nXFnAKi2ipFGPUo9ulguTSwniuN3HMuaxC29J5OasI7E2vY4TCZl1ikL++HpUzmu0\nKpGLJU3n6U6Vd4024gSLfnUeidvunUB6F4KclqSTG5ipVnviWJVIenyoDY1ZcDhM\ngc2GwAwpryRC8fLkzEpTtPyOjQKBgQC+76N2cBCTJhrTlExIctobUMUFgoaoUhgY\ny8HDHhrllzc0Tehx90dx5/ayc/o7/YPqL/St3cMkxcSb55Lpd5OBUQEeSk4q6DTi\nM4lpe5+U3/WQMmtlPV33PvlERyWRpMFgT7D7c0JiiZpXTBTFXxlHtxiODKnrkJgS\nd9c/bs8yVwKBgQC0yFGLM8WHAkuzKx2xq7l5b7E7MZ4zaglPaVrtnFaDrmcYyKc+\nE43szupeRtr8K9Qx/GEzN0K7Fjs5vyZCZdRRcNRuonvuI6mtY259nfMd07LLr5EY\nuq2Q+L2z7Fm5/EkYYGM/Qj10/1jon5mp6o1pWEMtKEVRFaPgxUXweXsL3QKBgC9l\nNOJVdwfP0aDrkvP47oMRTZbMi7iEiE6/ZV2Vv392RdHJ9QU1KJrxxZ8OgvMZPwGG\n3em6vpIGNYOtvB4P/KGBBhIKx9SGx3nO6TEx6q792OruWRJMZWLWUvHL51t71jSe\nE4SXW8cx+QnqbM2BibjvjjzUj+lVfyo2bUvlqbEJAoGAPCKfO94AkbOD40Ctruc9\nRfjTt+Pi8VMOAeiPmetPnuVxnRywS2WWuc5bTJ+3PyVoZdt0pMXmnFwnQT14a9ze\ntJwAkVY42n3xR29Y2DAf5VeurrCWrOMYjHsOBPrT+qvVO7hXjhDkg5snNyVbn2rq\nKour7sHlOZ6utjJ/Mg3rkiA=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@kc-tobe-friendcorner-21655.iam.gserviceaccount.com",
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

export default async function handler(req, res) {
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