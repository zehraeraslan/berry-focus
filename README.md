# Berry Focus 🍓

Kamera destekli "benimle çalış" ders çalışma platformu. Süreni seç, çalış; telefon tespiti ve gün sonu verimlilik paneli yolda.

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç. Kamera yalnızca `localhost` veya HTTPS üzerinde çalışır.

## Durum

- [x] Tema ve üç ekran (hazırlık, çalışma, özet)
- [x] Zaman damgası tabanlı zamanlayıcı (duraklat/devam, sekme arka plandayken sapmaz)
- [x] Kamera akışı (izin, ret ve hata durumları)
- [x] Telefon tespiti (MediaPipe, tarayıcıda, ~5 analiz/sn, zamansal yumuşatma)
- [x] Kademeli uyarılar (3 / 8 / 15 sn: baloncuk, ekran kenarı + zil, tam ekran + sesli komut)
- [ ] Gerçek oturum verisi ve verimlilik hesabı
