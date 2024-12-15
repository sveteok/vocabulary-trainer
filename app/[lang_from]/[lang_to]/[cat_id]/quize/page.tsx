import WordsWrapper from "@/app/ui/components/wordsWrapper";
import { QuizeCards } from "@/app/ui/cards/quize/quizeCards";

export default async function QuizePage({
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
      <QuizeCards />
    </WordsWrapper>
  );
}
