
// 5 harfli Türkçe kelimeler
const words = [
  "alaca", "adres", "altın", "araba", "avize", "alaka", "acele", "anket", "ateşe", "başak",
  "bakış", "balık", "beyin", "biçim", "bulut", "büyük", "beste", "beton", "ceviz", "ceket",
  "cesur", "cılız", "çiçek", "çevre", "çoban", "çatal", "dayak", "derin", "deniz", "dilek",
  "dünya", "dudak", "duygu", "emlak", "esnek", "evrak", "ezber", "fidan", "fincan", "firma",
  "gazoz", "gelin", "giriş", "güneş", "gümüş", "güzel", "hayal", "hazır", "heves", "hırka",
  "huzur", "ışık", "ikram", "ilaç", "insan", "irade", "istek", "izmir", "kalem", "kapak",
  "kargo", "kemer", "kısım", "köşe", "kumaş", "lamba", "limon", "liste", "lokum", "macun",
  "marka", "masal", "mamul", "merak", "meyve", "müzik", "nefes", "nehir", "niyet", "odun",
  "oğul", "okul", "onur", "orman", "oturum", "oyun", "öğlen", "örnek", "öykü", "paket",
  "pazar", "perde", "peynir", "posta", "rakam", "refah", "resim", "roman", "sabır", "sadık",
  "sayfa", "sebze", "sehpa", "sevgi", "sıcak", "silgi", "simge", "surat", "şapka", "şeker",
  "şifre", "şirin", "tabak", "tarak", "tatlı", "tavuk", "tebrik", "temel", "tiyatro", "toprak",
  "tuğla", "tulum", "tuval", "türkü", "ucuz", "umut", "uyku", "uzun", "ülke", "üzüm",
  "vakit", "vatan", "vergi", "vida", "yatak", "yazı", "yemek", "yeşil", "yürek", "zaman",
  "zafer", "zeytin", "zengin", "zincir", "dolap", "kitap", "merak", "tavan", "teker"
];

// Geçerli kelimeler listesi (tahminler için)
export const validWords = [...words];

// Rastgele bir kelime seçer
export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

// Bir kelimenin geçerli olup olmadığını kontrol eder
export const isValidWord = (word: string): boolean => {
  return validWords.includes(word.toLowerCase());
};
