export type Surah = {
  id: number;
  name: string;
  verses: number;
  type: "مكية" | "مدنية";
};

export const surahs: Surah[] = [
  { id: 1, name: "الفاتحة", verses: 7, type: "مكية" },
  { id: 2, name: "البقرة", verses: 286, type: "مدنية" },
  { id: 3, name: "آل عمران", verses: 200, type: "مدنية" },
  { id: 4, name: "النساء", verses: 176, type: "مدنية" },
  { id: 5, name: "المائدة", verses: 120, type: "مدنية" },
  { id: 6, name: "الأنعام", verses: 165, type: "مكية" },
  { id: 7, name: "الأعراف", verses: 206, type: "مكية" },
  { id: 8, name: "الأنفال", verses: 75, type: "مدنية" },
  { id: 9, name: "التوبة", verses: 129, type: "مدنية" },
  { id: 10, name: "يونس", verses: 109, type: "مكية" },
];
