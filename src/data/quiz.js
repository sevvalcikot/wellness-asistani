// Bilgi Kulesi'nin katları. Her kat: önce bir "Biliyor muydun?" kartı, sonra bir soru.
// dogru: doğru seçeneğin sırası (0 = A, 1 = B, 2 = C).
export const BILGI_KATLARI = [
  {
    bilgi: 'Düşüncelerimiz her zaman gerçeği yansıtmaz. Psikologlar sık görülen yanılgılara düşünce tuzağı der. Onları fark etmek, onlardan kurtulmanın ilk adımıdır.',
    soru: 'Hangisi bir düşünce tuzağı örneğidir?',
    secenekler: [
      'Bugün çok yorgunum, erken yatacağım.',
      'Bir kez hata yaptım, ben hiçbir şeyi beceremem.',
      'Sunumdan önce heyecanlanmam çok normal.'
    ],
    dogru: 1,
    kavram: 'Aşırı genelleme',
    aciklama: 'Bu bir aşırı genelleme: tek bir olaydan "hiçbir şeyi, her zaman" gibi kesin bir sonuç çıkarmak.'
  },
  {
    bilgi: 'Ya hep ya hiç düşüncesinde her şey ya kusursuzdur ya da tamamen başarısız. Aradaki tonları göremeyiz.',
    soru: 'Hangisi ya hep ya hiç düşüncesine örnektir?',
    secenekler: [
      'Sınavdan 100 alamazsam başarısız sayılırım.',
      'Bu konuyu biraz daha tekrar etmem iyi olur.',
      'Bugün yorgunum, yarın devam ederim.'
    ],
    dogru: 0,
    kavram: 'Ya hep ya hiç düşüncesi',
    aciklama: 'Sonucu yalnızca iki uca ayırıyor. Oysa 85 de iyi bir sonuçtur.'
  },
  {
    bilgi: 'Nefes verirken beden, sakinleşmeye yardım eden sinir sistemini daha çok devreye sokar. Bu yüzden nefes egzersizlerinde nefes vermek genellikle daha uzun tutulur.',
    soru: '4-7-8 nefes egzersizinde hangi aşama en uzun sürer?',
    secenekler: ['Nefes almak', 'Nefesi tutmak', 'Nefes vermek'],
    dogru: 2,
    kavram: '4-7-8 nefesi',
    aciklama: '4 saniye al, 7 saniye tut, 8 saniye ver. Uzun nefes vermek bedenin yavaşlamasına yardımcı olur.'
  }
];
