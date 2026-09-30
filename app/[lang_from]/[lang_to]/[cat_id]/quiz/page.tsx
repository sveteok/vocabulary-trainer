import WordsWrapper from "@/ui/basis/wordsWrapper";
import { QuizCards } from "@/ui/cards/quiz/quizCards";

export default async function QuizPage({
  params,
}: {
  params: Promise<{
    cat_id: string;
    lang_from: string;
    lang_to: string;
  }>;
}) {
  return (
    <WordsWrapper params={await params}>
      <QuizCards />
    </WordsWrapper>
  );
}
