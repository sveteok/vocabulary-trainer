import WordsWrapper from "@/ui/basis/wordsWrapper";
import { WriteCards } from "@/ui/cards/write/writeCards";

export default async function WritePage({
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
      <WriteCards />
    </WordsWrapper>
  );
}
