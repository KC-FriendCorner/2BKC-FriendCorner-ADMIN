const admin = require('firebase-admin');

// 🚩 ตรวจสอบให้แน่ใจว่าได้ใส่ private_key ตัวเต็มที่มีเครื่องหมาย \n ครบถ้วน
const serviceAccount = {
    "type": "service_account",
    "project_id": "kc-tobe-friendcorner-21655",
    "private_key_id": "155d3f45fc7f5e73bf1b58942e713d958f0639e0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDL7tGMWoeKEJA0\ny8ok/OnYb8FCgcVM+NJHYOnmyu6mC9bccOwoam3Hw142U98dmnLPUOJQ5UgjSEdf\nxrhWw7vjNOZoG5YrJdFezrdia+OLa2FFt4nruw0KEkZi9Aeok+hP0FLE8VuNiVl2\nyiJCl5wWZN3ZiJgO6MIawcgrO0Z6sLJ3CCWYRAJHyFzLFk7aZlwoGjKpDLFtZKWj\nyIQq0MtWBx1mKKUyT4X39FokS4y1FSAh6L9eHi385lW6HRqzkKvaoUSsEkLHF3ck\nBd08yTgi/qlEg2jgd2hXxwsK+Zr6SD+E0DWXhiiyI0MA1OABPsRlsIcjzzMwBAR4\nxQR96Js/AgMBAAECggEACBknPB4aNMrclyQill5uwNgLQiNaHOjinNAF6dLUMEbX\nFPDtB9vWGTEybBDfktLfzUjGe/Tm7PPBVdXT2yoxq1+d6LNzvqnlSxEFakSjiBVP\nCxAzS2elqGk6X1KWfUTGXGkG6Gg3PQMfyN5VBvTzT1ZZEvrgIvNuRda9Jq5XaabJ\ngRmVF9k11QUSYwh97DgBOCEFFpkskXDTi5rGOQOy+JJXbSoW1V0TwLHFvGnmx6AH\ns5TEo6nadRzpoImilFTZbJwY3mgjP5tqFLlrIu1S9hYizp7tSsMpJxF1PE/7KT2F\nZtg5A1SHW/wYPaU721EYfF3cRed3xgTf9tiJztM4jQKBgQDoqtA/nnPPR9co2ZoK\nsjS5dnnGj6514SwHHBHYMUpmdHoiGq3pIKjUM3uOfDCMD/nq85poyTP6T8jxLKRs\nRkpRyJ/e4XDVZocAc78wXysVpJ9u3szX3nFmiNueP/8KrZuoG/3PlAngfH255qTx\ng5RoV76SYF5GX/Qm31mDtDzAjQKBgQDgYlFbPG1SmiRQT9TNA48wR6lzXdrY39ft\nCKQlhyHEH3Ek2rM/Jcam+DXdGTbFq9z1YQRkzW1pVrZUbOLbYkPE5p+fe71ZI4L4\nBwkpEbT3hB3sRMlQXLjx5kVaBwKuefRJd4P3AFVokipPCsuY24MhbnVPuhKS24HT\nTFljcE1V+wKBgQDIvK8FZJEociQJY4yK0+u3Y6d3D/oGTCqvS6F9tDErqizBheEr\n9PiUdIKSkUVVYmdONbSv2YAV44ZLxidqH075tq1wH3M5OscZNcPrWQCUIL9JacK0\nMIAIZeWNaEuEC/rzFItr756B5waWQI9orAx75dBO/AP6lcjRTPwvLG8J9QKBgBLm\nNRQKMusSMJzTHIloE1dtscgVz6kUsYs1fx3qE94BB/aitRZMiD7oCSFmTka4AxRn\n54bWBrEorJLP2QvBaxPamPdF5NztMMrTTOI4q5Vte1e7M3mhVbKKQq0iigdIHltR\nxbu4O3ljVkzyC9QEKTdXpmngsk/MTVMOyzik7N6hAoGAGf1p8wfyT7GoDwNBtYmW\nmsTtnAmqAfswQnXSfXUV2d7+Tg+S8XsTiZYNKja+YRQHhvU+ovp65QhTZVIxEOIr\nZOBWB9xv2SfHeH7fKhzHyyXsGSWp6aHLlpJj3QB2FaAQhibMVQhmh4wgRkksgZcd\nU7xJWSY3pw2oakj7BJweN2A=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
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