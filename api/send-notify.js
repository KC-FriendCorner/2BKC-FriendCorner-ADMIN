const admin = require('firebase-admin');

// ดึงฟังก์ชัน Initialize ออกมาด้านนอกเพื่อให้เรียกใช้ได้ชัวร์
function initFirebase() {
    if (admin.apps.length === 0) {
        const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
        const pKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim();

        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId: "kc-tobe-friendcorner-21655",
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: pKey,
            }),
        });
    }
    return admin.app();
}

module.exports = async (req, res) => {
    // 1. CORS Setup
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. รับข้อมูล
    const { token, title, body, image } = req.body;
    if (!token || !title || !body) {
        return res.status(400).json({ error: 'Missing token, title or body' });
    }

    try {
        const app = initFirebase();

        // 3. สร้าง Payload ที่ครอบคลุมทุก Platform
        const message = {
            token: token,
            notification: {
                title: title,
                body: body,
                image: image || 'https://2bkc-baojai-zone.vercel.app/KCปก1.png'
            },
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    // ถ้าผู้ใช้กดที่แจ้งเตือน ให้เปิดแอปหรือเว็บทันที
                    clickAction: 'https://2bkc-baojai-zone.vercel.app/'
                }
            },
            // เพิ่มส่วนนี้สำหรับ iOS โดยเฉพาะ
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: title,
                            body: body,
                        },
                        sound: 'default',
                        badge: 1, // แสดงตัวเลขสีแดงบนไอคอนแอป
                        'mutable-content': 1, // จำเป็นสำหรับการแสดงรูปภาพบน iOS
                        'content-available': 1
                    }
                },
                fcm_options: {
                    image: image || 'https://2bkc-baojai-zone.vercel.app/KCปก1.png'
                }
            },
            webpush: {
                headers: { Urgency: 'high' },
                notification: {
                    icon: 'https://2bkc-baojai-zone.vercel.app/KCปก1.png',
                    badge: 'https://2bkc-baojai-zone.vercel.app/badge.png', // รูปเล็กๆ บน Status bar
                    requireInteraction: true // แจ้งเตือนจะไม่หายไปจนกว่าผู้ใช้จะกดปิด (ช่วยเรื่องเห็นช้า)
                },
                fcmOptions: {
                    link: 'https://2bkc-baojai-zone.vercel.app/'
                }
            },
            data: {
                url: "https://2bkc-baojai-zone.vercel.app/"
            }
        };

        const response = await app.messaging().send(message);
        return res.status(200).json({ success: true, messageId: response });

    } catch (error) {
        console.error('FCM Error:', error);

        // ตรวจสอบ Error เฉพาะทาง (เช่น Token หมดอายุ)
        if (error.code === 'messaging/registration-token-not-registered') {
            return res.status(410).json({ error: 'Token is no longer valid' });
        }

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};