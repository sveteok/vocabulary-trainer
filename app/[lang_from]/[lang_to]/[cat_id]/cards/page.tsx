import { CardSlideShow } from "@/ui/cards/slide/cardSlideShow";
import WordsWrapper from "@/ui/basis/wordsWrapper";

export default async function CardsPage({
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
      <CardSlideShow />
    </WordsWrapper>
  );
}
