import manifest from "../../../../data/science6_pilot/manifest.json";

export type ScienceLessonIndexItem = { id: string; number: number; title: string };

export const SCIENCE_LESSON_INDEX: readonly ScienceLessonIndexItem[] = manifest.lessons.map(item=>({
  id:item.lesson_id,
  number:item.lesson_number,
  title:item.title_vi,
}));

export const SCIENCE_S1_LESSON_INDEX = SCIENCE_LESSON_INDEX.filter(item => item.number <= 28);
export const SCIENCE_S2_LESSON_INDEX = SCIENCE_LESSON_INDEX.filter(item => item.number >= 29);
