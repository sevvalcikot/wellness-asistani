// Düşünce Avcısı oyununun kartları.
// tuzak: true ise kart bir düşünce tuzağıdır (bilişsel çarpıtma).
// Yeni kart eklemek için listeye aynı biçimde bir nesne eklemen yeterli.
// Her oyunda 2 tuzak + 1 gerçekçi kart rastgele seçilir.
export const DUSUNCE_KARTLARI = [
  {
    id: 'felaket-sinav',
    metin: 'Sınavdan kalırsam her şey mahvolur.',
    tuzak: true,
    tuzakAdi: 'Felaketleştirme',
    aciklama: 'Tek bir olumsuz sonucu her şeyin sonu gibi görmek. Kaygıyı büyüten çok yaygın bir düşünce tuzağı.',
    gercekci: 'Kalırsam üzülürüm ama tekrar deneme şansım var.'
  },
  {
    id: 'zihin-mesaj',
    metin: 'Arkadaşım mesajıma cevap vermedi, kesin bana kızgın.',
    tuzak: true,
    tuzakAdi: 'Zihin okuma',
    aciklama: 'Başkasının ne düşündüğünü kanıt olmadan bildiğini sanmak.',
    gercekci: 'Belki sadece meşgul. Emin olmak için sorabilirim.'
  },
  {
    id: 'genelleme-sunum',
    metin: 'Sunumda bir kez takıldım, ben hiçbir zaman iyi konuşamam.',
    tuzak: true,
    tuzakAdi: 'Aşırı genelleme',
    aciklama: 'Tek bir olaydan "hiçbir zaman, her zaman" gibi kesin bir sonuç çıkarmak.',
    gercekci: 'Bir kez takıldım; pratik yaptıkça daha rahat konuşurum.'
  },
  {
    id: 'hephic-plan',
    metin: 'Planımın hepsini yapamadıysam bugün tamamen boşa geçti.',
    tuzak: true,
    tuzakAdi: 'Ya hep ya hiç düşüncesi',
    aciklama: 'Her şeyi iki uca ayırmak: ya kusursuz ya da tamamen başarısız. Aradaki tonları görmemek.',
    gercekci: 'Planımın bir kısmını yaptım, bu da bir ilerleme.'
  },
  {
    id: 'olumlu-odev',
    metin: 'Hocam ödevimi beğendi ama bence sadece nezaketen söyledi.',
    tuzak: true,
    tuzakAdi: 'Olumluyu küçümseme',
    aciklama: 'İyi giden şeyleri "sayılmaz" diyerek geçiştirmek.',
    gercekci: 'Hocam beğendiğini söyledi; bunu kabul edebilirim.'
  },
  {
    id: 'gercek-calisma',
    metin: 'Bu hafta iki gün iyi çalıştım, yarın da biraz çalışabilirim.',
    tuzak: false,
    aciklama: 'Kanıta dayanıyor ve sana yol gösteriyor. Gerçekçi düşünceler böyle olur.'
  },
  {
    id: 'gercek-gorusme',
    metin: 'Yarınki görüşme için biraz gerginim; bu normal, hazırlık yapabilirim.',
    tuzak: false,
    aciklama: 'Duyguyu fark ediyor, abartmıyor ve bir çözüm öneriyor.'
  }
];
