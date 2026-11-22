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
  },
  {
    id: 'etiket-sunum',
    metin: 'Bir teslim tarihini kaçırdım, ben tam bir sorumsuzum.',
    tuzak: true,
    tuzakAdi: 'Etiketleme',
    aciklama: 'Tek bir davranıştan kendine kalıcı ve olumsuz bir etiket yapıştırmak.',
    gercekci: 'Bir teslim tarihini kaçırdım; bir dahakine takvime not alabilirim.'
  },
  {
    id: 'meli-yardim',
    metin: 'Her zaman herkese yardım etmeliyim, yoksa kötü biriyim.',
    tuzak: true,
    tuzakAdi: 'Meli-malı düşüncesi',
    aciklama: 'Kendine katı kurallar koymak; uyamadığında suçluluk ve baskı büyür.',
    gercekci: 'Yardım etmeyi severim ama bazen hayır demek de hakkım.'
  },
  {
    id: 'kisisel-proje',
    metin: 'Grup projesi kötü geçti, hepsi benim yüzümden.',
    tuzak: true,
    tuzakAdi: 'Kişiselleştirme',
    aciklama: 'Birçok etkenin olduğu bir sonucun bütün sorumluluğunu tek başına üstlenmek.',
    gercekci: 'Projede birçok etken vardı; kendi payıma düşenden ders çıkarabilirim.'
  },
  {
    id: 'falci-sinav',
    metin: 'Yarınki sınav kesin kötü geçecek, biliyorum.',
    tuzak: true,
    tuzakAdi: 'Falcılık',
    aciklama: 'Geleceği olumsuz şekilde kesin biliyormuş gibi tahmin etmek.',
    gercekci: 'Sınavın nasıl geçeceğini bilemem; bugün biraz daha tekrar yapabilirim.'
  },
  {
    id: 'duygusal-aptal',
    metin: 'Kendimi aptal gibi hissediyorum, demek ki aptalım.',
    tuzak: true,
    tuzakAdi: 'Duygusal çıkarım',
    aciklama: 'Bir şeyi hissetmeyi, onun gerçek olduğunun kanıtı saymak.',
    gercekci: 'Kendimi öyle hissetmem, öyle olduğum anlamına gelmez.'
  },
  {
    id: 'gercek-destek',
    metin: 'Bu dönem zor geçiyor ama yardım isteyebileceğim insanlar var.',
    tuzak: false,
    aciklama: 'Zorluğu kabul ediyor ve elindeki kaynakları görüyor.'
  },
  {
    id: 'gercek-yuruyus',
    metin: 'Bugün hiç dışarı çıkamadım; yarın kısa bir yürüyüş yapabilirim.',
    tuzak: false,
    aciklama: 'Kendini suçlamadan durumu görüyor ve küçük, uygulanabilir bir adım öneriyor.'
  }
];
