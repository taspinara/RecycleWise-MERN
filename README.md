# RecycleWise

**Akıllı ve etkileşimli bir geri dönüşüm platformu**

RecycleWise, kullanıcıların karşılaştıkları her türlü atığı (plastik, elektronik atık, pil, gıda vb.) AI destekli tarayıcıyla tanımlayıp nasıl geri dönüştürebileceklerini gösteren; puan, rozet ve liderlik tablosuyla süreçleri eğlenceli hâle getiren bir MERN (MongoDB, Express.js, React, Node.js) uygulamasıdır.

---

## 📋 İçindekiler

1. [Özellikler](#-özellikler)  
2. [Kurulum](#-kurulum)  
3. [Kullanım](#-kullanım)  
4. [Çevresel Değişkenler](#-çevresel-değişkenler)  
5. [Proje Yapısı](#-proje-yapısı)  
6. [Geliştirme](#-geliştirme)  
7. [Katkıda Bulunma](#-katkıda-bulunma)  
8. [Lisans](#-lisans)  

---

## 🚀 Özellikler

- **Material Scanner**: Görsel yükleyip AI ile geri dönüştürülebilirliği tespit etme  
- **Dashboard**: Kullanıcının puan ve aktivitelerini grafiksel takip  
- **Leaderboard**: En çevreci kullanıcıları sıralama  
- **Eco Blog**: Kısa çevre yazıları ve yorumlar  
- **Challenges**: Geri dönüşüm görevlerine katılarak ek puan kazanma  
- **Gruplar**: Arkadaş davet etme ve geri dönüşüm günü hatırlatma  
- **Impact Calculator**: Çevresel katkınızı sayısal olarak gösterme  
- **Email Hatırlatıcı**: Günlük geri dönüşüm hatırlatmaları  

---

## 🔧 Kurulum

1. Depoyu klonlayın:  
   ```bash
   git clone https://github.com/taspinara/RecycleWise-MERN.git
   cd recyclewise

2. Sunucu ve istemci dizinlerine girip bağımlılıkları yükleyin:

    cd server
    npm install

    cd ../client
    npm install

3. Ortam değişkenlerini ayarlayın – bkz. Çevresel Değişkenler.

4. Sunucu ve istemciyi ayrı terminallerde başlatın:

    # server/
    npm run dev

    # client/
    npm start

5. Tarayıcıda http://localhost:3000 adresine gidin.

---

## 🚀 Kullanım

1. **Kayıt ve Giriş**  
   - Kaydolmak için `/register` sayfasına gidin.  
   - Giriş yapmak için `/login` sayfasını kullanın.  
   - Başarılı girişten sonra otomatik olarak **Dashboard**’a yönlendirilirsiniz.

2. **Dashboard**  
   - Toplam eco-puanınızı ve son aktivitelerinizi grafiklerle görebilirsiniz.  
   - Sol üst menüden diğer modüllere erişim sağlayın.

3. **Material Scanner**  
   - Sol menüdeki **Scanner** (Tarayıcı) sekmesine tıklayın.  
   - “Resim Yükle” düğmesiyle ürün fotoğrafınızı seçin.  
   - “Analiz Et” butonuna basın; birkaç saniye içinde geri dönüşüm talimatı ve kazanılan puan ekranda görünecek.

4. **Blog & Yorum**  
   - Navigasyon’dan **Blog** bölümüne gidin.  
   - “Yeni Yazı” butonuyla kendi çevre ipuçlarınızı paylaşın.  
   - Var olan bir yazıya tıklayıp yorum kısmından fikir alışverişi yapın.

5. **Leaderboard**  
   - **Leaderboard** sayfası, en yüksek puanlı kullanıcıları sıralar.  
   - Arkadaşlarınızla yarışın ve çevre ödülleri kazanın!

6. **Challenges**  
   - **Challenges** sekmesinde aktif geri dönüşüm görevleri listelenir.  
   - “Katıl” diyerek görevleri tamamlayın, ekstra eco-puan toplayın.

7. **Gruplar**  
   - **Gruplar** sayfasında yeni grup oluşturun veya var olanlara katılın.  
   - Davet linki paylaşarak arkadaşlarınızı ekleyebilir, grup sohbeti ve toplama günü hatırlatmaları organize edebilirsiniz.

8. **Profil ve Ayarlar**  
   - Sağ üst köşedeki profil ikonuna tıklayıp **Ayarlar**’a girin.  
   - E-posta hatırlatmalarını açıp kapatabilir, bildirim tercihlerinizi yönetebilirsiniz.

9. **Impact Calculator**  
   - Dashboard içindeki **Impact Calculator** sekmesinden çevresel tasarrufunuzu sayısal olarak görün.

---

## ⚙️ Çevresel Değişkenler

Server tarafı için server/.env dosyasına eklemeniz gerekenler:

PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000      # (AI mikroservis adresi)
SMTP_HOST=smtp.example.com               # (e-posta sunucusu)
SMTP_PORT=587
SMTP_USER=your_email_user
SMTP_PASS=your_email_password

Client tarafı için client/.env:

REACT_APP_API_URL=http://localhost:5000

---

## 📁 Proje Yapısı

/client         # React uygulaması
  ├── public
  └── src
      ├── components
      ├── pages
      ├── store
      └── utils

/server         # Express.js API
  ├── controllers
  ├── middleware
  ├── models
  ├── routes
  └── utils

---

## 🛠 Geliştirme

1. Kod stilini korumak için ESLint & Prettier kullanıyoruz.

2. Sunucu için nodemon ile otomatik yeniden başlatma:

    cd server
    npm run dev

3. Client için CRA’nın sunduğu hot-reload özelliği zaten aktif.

---

## 🤝 Katkıda Bulunma

1. Fork’la

2. Yeni bir branch aç: git checkout -b feature/özellik-adı

3. Değişikliklerini commit et: git commit -m 'feat: özellik açıklaması'

4. Push et: git push origin feature/özellik-adı

5. Pull request oluştur.

---

## 📄 Lisans

    MIT © [Sizin İsminiz veya Organizasyonunuz]