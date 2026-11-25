export type Surah = {
  id: number;
  name: string;
  verses: number;
  type: "مكية" | "مدنية";
  juz: number[];
};

export const surahs: Surah[] = [
  {
    "id": 1,
    "name": "الفاتحة",
    "verses": 7,
    "type": "مكية",
    "juz": [1]
  },
  {
    "id": 2,
    "name": "البقرة",
    "verses": 286,
    "type": "مدنية",
    "juz": [1, 2, 3]
  },
  {
    "id": 3,
    "name": "آل عمران",
    "verses": 200,
    "type": "مدنية",
    "juz": [3, 4]
  },
  {
    "id": 4,
    "name": "النساء",
    "verses": 176,
    "type": "مدنية",
    "juz": [4, 5, 6]
  },
  {
    "id": 5,
    "name": "المائدة",
    "verses": 120,
    "type": "مدنية",
    "juz": [6, 7]
  },
  {
    "id": 6,
    "name": "الأنعام",
    "verses": 165,
    "type": "مكية",
    "juz": [7, 8]
  },
  {
    "id": 7,
    "name": "الأعراف",
    "verses": 206,
    "type": "مكية",
    "juz": [8, 9]
  },
  {
    "id": 8,
    "name": "الأنفال",
    "verses": 75,
    "type": "مدنية",
    "juz": [9, 10]
  },
  {
    "id": 9,
    "name": "التوبة",
    "verses": 129,
    "type": "مدنية",
    "juz": [10, 11]
  },
  {
    "id": 10,
    "name": "يونس",
    "verses": 109,
    "type": "مكية",
    "juz": [11]
  },
  {
    "id": 11,
    "name": "هود",
    "verses": 123,
    "type": "مكية",
    "juz": [11, 12]
  },
  {
    "id": 12,
    "name": "يوسف",
    "verses": 111,
    "type": "مكية",
    "juz": [12, 13]
  },
  {
    "id": 13,
    "name": "الرعد",
    "verses": 43,
    "type": "مدنية",
    "juz": [13]
  },
  {
    "id": 14,
    "name": "ابراهيم",
    "verses": 52,
    "type": "مكية",
    "juz": [13]
  },
  {
    "id": 15,
    "name": "الحجر",
    "verses": 99,
    "type": "مكية",
    "juz": [14]
  },
  {
    "id": 16,
    "name": "النحل",
    "verses": 128,
    "type": "مكية",
    "juz": [14]
  },
  {
    "id": 17,
    "name": "الإسراء",
    "verses": 111,
    "type": "مكية",
    "juz": [15]
  },
  {
    "id": 18,
    "name": "الكهف",
    "verses": 110,
    "type": "مكية",
    "juz": [15, 16]
  },
  {
    "id": 19,
    "name": "مريم",
    "verses": 98,
    "type": "مكية",
    "juz": [16]
  },
  {
    "id": 20,
    "name": "طه",
    "verses": 135,
    "type": "مكية",
    "juz": [16]
  },
  {
    "id": 21,
    "name": "الأنبياء",
    "verses": 112,
    "type": "مكية",
    "juz": [17]
  },
  {
    "id": 22,
    "name": "الحج",
    "verses": 78,
    "type": "مدنية",
    "juz": [17]
  },
  {
    "id": 23,
    "name": "المؤمنون",
    "verses": 118,
    "type": "مكية",
    "juz": [18]
  },
  {
    "id": 24,
    "name": "النور",
    "verses": 64,
    "type": "مدنية",
    "juz": [18]
  },
  {
    "id": 25,
    "name": "الفرقان",
    "verses": 77,
    "type": "مكية",
    "juz": [18, 19]
  },
  {
    "id": 26,
    "name": "الشعراء",
    "verses": 227,
    "type": "مكية",
    "juz": [19]
  },
  {
    "id": 27,
    "name": "النمل",
    "verses": 93,
    "type": "مكية",
    "juz": [19, 20]
  },
  {
    "id": 28,
    "name": "القصص",
    "verses": 88,
    "type": "مكية",
    "juz": [20]
  },
  {
    "id": 29,
    "name": "العنكبوت",
    "verses": 69,
    "type": "مكية",
    "juz": [20, 21]
  },
  {
    "id": 30,
    "name": "الروم",
    "verses": 60,
    "type": "مكية",
    "juz": [21]
  },
  {
    "id": 31,
    "name": "لقمان",
    "verses": 34,
    "type": "مكية",
    "juz": [21]
  },
  {
    "id": 32,
    "name": "السجدة",
    "verses": 30,
    "type": "مكية",
    "juz": [21]
  },
  {
    "id": 33,
    "name": "الأحزاب",
    "verses": 73,
    "type": "مدنية",
    "juz": [21, 22]
  },
  {
    "id": 34,
    "name": "سبإ",
    "verses": 54,
    "type": "مكية",
    "juz": [22]
  },
  {
    "id": 35,
    "name": "فاطر",
    "verses": 45,
    "type": "مكية",
    "juz": [22]
  },
  {
    "id": 36,
    "name": "يس",
    "verses": 83,
    "type": "مكية",
    "juz": [22, 23]
  },
  {
    "id": 37,
    "name": "الصافات",
    "verses": 182,
    "type": "مكية",
    "juz": [23]
  },
  {
    "id": 38,
    "name": "ص",
    "verses": 88,
    "type": "مكية",
    "juz": [23]
  },
  {
    "id": 39,
    "name": "الزمر",
    "verses": 75,
    "type": "مكية",
    "juz": [23, 24]
  },
  {
    "id": 40,
    "name": "غافر",
    "verses": 85,
    "type": "مكية",
    "juz": [24]
  },
  {
    "id": 41,
    "name": "فصلت",
    "verses": 54,
    "type": "مكية",
    "juz": [24, 25]
  },
  {
    "id": 42,
    "name": "الشورى",
    "verses": 53,
    "type": "مكية",
    "juz": [25]
  },
  {
    "id": 43,
    "name": "الزخرف",
    "verses": 89,
    "type": "مكية",
    "juz": [25]
  },
  {
    "id": 44,
    "name": "الدخان",
    "verses": 59,
    "type": "مكية",
    "juz": [25]
  },
  {
    "id": 45,
    "name": "الجاثية",
    "verses": 37,
    "type": "مكية",
    "juz": [25]
  },
  {
    "id": 46,
    "name": "الأحقاف",
    "verses": 35,
    "type": "مكية",
    "juz": [26]
  },
  {
    "id": 47,
    "name": "محمد",
    "verses": 38,
    "type": "مدنية",
    "juz": [26]
  },
  {
    "id": 48,
    "name": "الفتح",
    "verses": 29,
    "type": "مدنية",
    "juz": [26]
  },
  {
    "id": 49,
    "name": "الحجرات",
    "verses": 18,
    "type": "مدنية",
    "juz": [26]
  },
  {
    "id": 50,
    "name": "ق",
    "verses": 45,
    "type": "مكية",
    "juz": [26]
  },
  {
    "id": 51,
    "name": "الذاريات",
    "verses": 60,
    "type": "مكية",
    "juz": [26, 27]
  },
  {
    "id": 52,
    "name": "الطور",
    "verses": 49,
    "type": "مكية",
    "juz": [27]
  },
  {
    "id": 53,
    "name": "النجم",
    "verses": 62,
    "type": "مكية",
    "juz": [27]
  },
  {
    "id": 54,
    "name": "القمر",
    "verses": 55,
    "type": "مكية",
    "juz": [27]
  },
  {
    "id": 55,
    "name": "الرحمن",
    "verses": 78,
    "type": "مدنية",
    "juz": [27]
  },
  {
    "id": 56,
    "name": "الواقعة",
    "verses": 96,
    "type": "مكية",
    "juz": [27]
  },
  {
    "id": 57,
    "name": "الحديد",
    "verses": 29,
    "type": "مدنية",
    "juz": [27]
  },
  {
    "id": 58,
    "name": "المجادلة",
    "verses": 22,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 59,
    "name": "الحشر",
    "verses": 24,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 60,
    "name": "الممتحنة",
    "verses": 13,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 61,
    "name": "الصف",
    "verses": 14,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 62,
    "name": "الجمعة",
    "verses": 11,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 63,
    "name": "المنافقون",
    "verses": 11,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 64,
    "name": "التغابن",
    "verses": 18,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 65,
    "name": "الطلاق",
    "verses": 12,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 66,
    "name": "التحريم",
    "verses": 12,
    "type": "مدنية",
    "juz": [28]
  },
  {
    "id": 67,
    "name": "الملك",
    "verses": 30,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 68,
    "name": "القلم",
    "verses": 52,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 69,
    "name": "الحاقة",
    "verses": 52,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 70,
    "name": "المعارج",
    "verses": 44,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 71,
    "name": "نوح",
    "verses": 28,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 72,
    "name": "الجن",
    "verses": 28,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 73,
    "name": "المزمل",
    "verses": 20,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 74,
    "name": "المدثر",
    "verses": 56,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 75,
    "name": "القيامة",
    "verses": 40,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 76,
    "name": "الانسان",
    "verses": 31,
    "type": "مدنية",
    "juz": [29]
  },
  {
    "id": 77,
    "name": "المرسلات",
    "verses": 50,
    "type": "مكية",
    "juz": [29]
  },
  {
    "id": 78,
    "name": "النبإ",
    "verses": 40,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 79,
    "name": "النازعات",
    "verses": 46,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 80,
    "name": "عبس",
    "verses": 42,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 81,
    "name": "التكوير",
    "verses": 29,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 82,
    "name": "الإنفطار",
    "verses": 19,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 83,
    "name": "المطففين",
    "verses": 36,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 84,
    "name": "الإنشقاق",
    "verses": 25,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 85,
    "name": "البروج",
    "verses": 22,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 86,
    "name": "الطارق",
    "verses": 17,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 87,
    "name": "الأعلى",
    "verses": 19,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 88,
    "name": "الغاشية",
    "verses": 26,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 89,
    "name": "الفجر",
    "verses": 30,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 90,
    "name": "البلد",
    "verses": 20,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 91,
    "name": "الشمس",
    "verses": 15,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 92,
    "name": "الليل",
    "verses": 21,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 93,
    "name": "الضحى",
    "verses": 11,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 94,
    "name": "الشرح",
    "verses": 8,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 95,
    "name": "التين",
    "verses": 8,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 96,
    "name": "العلق",
    "verses": 19,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 97,
    "name": "القدر",
    "verses": 5,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 98,
    "name": "البينة",
    "verses": 8,
    "type": "مدنية",
    "juz": [30]
  },
  {
    "id": 99,
    "name": "الزلزلة",
    "verses": 8,
    "type": "مدنية",
    "juz": [30]
  },
  {
    "id": 100,
    "name": "العاديات",
    "verses": 11,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 101,
    "name": "القارعة",
    "verses": 11,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 102,
    "name": "التكاثر",
    "verses": 8,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 103,
    "name": "العصر",
    "verses": 3,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 104,
    "name": "الهمزة",
    "verses": 9,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 105,
    "name": "الفيل",
    "verses": 5,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 106,
    "name": "قريش",
    "verses": 4,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 107,
    "name": "الماعون",
    "verses": 7,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 108,
    "name": "الكوثر",
    "verses": 3,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 109,
    "name": "الكافرون",
    "verses": 6,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 110,
    "name": "النصر",
    "verses": 3,
    "type": "مدنية",
    "juz": [30]
  },
  {
    "id": 111,
    "name": "المسد",
    "verses": 5,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 112,
    "name": "الإخلاص",
    "verses": 4,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 113,
    "name": "الفلق",
    "verses": 5,
    "type": "مكية",
    "juz": [30]
  },
  {
    "id": 114,
    "name": "الناس",
    "verses": 6,
    "type": "مكية",
    "juz": [30]
  }
];
