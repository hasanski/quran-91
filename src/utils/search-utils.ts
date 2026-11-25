export function getJuzFromQuery(query: string): number | null {
  const normalizedQuery = normalizeArabic(replaceArabicDigits(query.trim().toLowerCase()));

  // 1. Try to match digits (e.g., جزء 30, juz 30, джуз 30, الجزء30, جزء٣٠)
  const regexNum = /(?:جزء|juz|джуз)\s*(\d+)/i;
  const matchNum = normalizedQuery.match(regexNum);
  if (matchNum) {
    const num = parseInt(matchNum[1], 10);
    if (num >= 1 && num <= 30) {
      return num;
    }
  }

  // 2. Try to match Arabic words for numbers 1 to 30
  if (normalizedQuery.includes("جزء") || normalizedQuery.includes("juz") || normalizedQuery.includes("джуз")) {
    const juzWordMapping = [
      { num: 1, words: ["اول", "الأول", "الاول", "الأولى", "الاولى"] },
      { num: 2, words: ["ثاني", "الثاني"] },
      { num: 3, words: ["ثالث", "الثالث"] },
      { num: 4, words: ["رابع", "الرابع"] },
      { num: 5, words: ["خامس", "الخامس"] },
      { num: 6, words: ["سادس", "السادس"] },
      { num: 7, words: ["سابع", "السابع"] },
      { num: 8, words: ["ثامن", "الثامن"] },
      { num: 9, words: ["تاسع", "التاسع"] },
      { num: 10, words: ["عاشر", "العاشر"] },
      { num: 11, words: ["حادي عشر", "الحادي عشر"] },
      { num: 12, words: ["ثاني عشر", "الثاني عشر"] },
      { num: 13, words: ["ثالث عشر", "الثالث عشر"] },
      { num: 14, words: ["رابع عشر", "الرابع عشر"] },
      { num: 15, words: ["خامس عشر", "الخامس عشر"] },
      { num: 16, words: ["سادس عشر", "السادس عشر"] },
      { num: 17, words: ["سابع عشر", "السابع عشر"] },
      { num: 18, words: ["ثامن عشر", "الثامن عشر"] },
      { num: 19, words: ["تاسع عشر", "التاسع عشر"] },
      { num: 20, words: ["عشرون", "العشرون", "عشرين", "العشرين"] },
      { num: 21, words: ["حادي وعشرين", "الحادي وعشرين", "حادي وعشرون", "الحادي والعشرون"] },
      { num: 22, words: ["ثاني وعشرين", "الثاني وعشرين", "ثاني وعشرون", "الثاني والعشرون"] },
      { num: 23, words: ["ثالث وعشرين", "الثالث وعشرين", "ثالث وعشرون", "الثالث والعشرون"] },
      { num: 24, words: ["رابع وعشرين", "الرابع وعشرين", "رابع وعشرون", "الرابع والعشرون"] },
      { num: 25, words: ["خامس وعشرين", "الخامس وعشرين", "خامس وعشرون", "الخامس والعشرون"] },
      { num: 26, words: ["سادس وعشرين", "السادس وعشرين", "سادس وعشرون", "السادس والعشرون"] },
      { num: 27, words: ["سابع وعشرين", "السابع وعشرين", "سابع وعشرون", "السابع والعشرون"] },
      { num: 28, words: ["ثامن وعشرين", "الثامن وعشرين", "ثامن وعشرون", "الثامن والعشرون"] },
      { num: 29, words: ["تاسع وعشرين", "التاسع وعشرين", "تاسع وعشرون", "التاسع والعشرون"] },
      { num: 30, words: ["ثلاثون", "الثلاثون", "ثلاثين", "الثلاثين"] },
    ];

    for (const mapping of juzWordMapping) {
      const normalizedWords = mapping.words.map(w => normalizeArabic(w.toLowerCase()));
      if (normalizedWords.some(word => normalizedQuery.includes(word))) {
        return mapping.num;
      }
    }
  }

  return null;
}

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F]/g, "") // remove Harakat (diacritics)
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

function replaceArabicDigits(str: string): string {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[٠-٩]/g, (d) => digits.indexOf(d).toString());
}
