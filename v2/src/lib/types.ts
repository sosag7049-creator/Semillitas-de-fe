export type Testament = "antiguo" | "nuevo";

export type Category = "Jesús" | "Fe" | "Carácter" | "Dios";

export interface StoryPart {
  title: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Índice de la opción correcta dentro de `options`. */
  answer: number;
}

export interface MemoryVerse {
  text: string;
  reference: string;
  excerpt: boolean;
  sourceUrl: string;
}

export interface LessonActivity {
  title: string;
  steps: string[];
}

export interface Lesson {
  id: string;
  number: number;
  slug: string;
  title: string;
  icon: string;
  category: Category;
  testament: Testament;
  /** Pasaje bíblico de la lección, p. ej. «Génesis 1». */
  reference: string;
  objective: string;
  application: string;
  narration: string;
  dynamic: string;
  craft: string;
  drawPrompt: string;
  age: string;
  duration: string;
  bibleVersion: string;
  coverImage: string | null;
  /** Historia dividida en escenas. */
  story: StoryPart[];
  takeaways: string[];
  questions: string[];
  quiz: QuizQuestion[];
  activity: LessonActivity;
  memory: MemoryVerse;
  videoId: string | null;
  videoQuery: string | null;
  videoUrl: string | null;
  printableUrl: string | null;
  prayer: string;
}
