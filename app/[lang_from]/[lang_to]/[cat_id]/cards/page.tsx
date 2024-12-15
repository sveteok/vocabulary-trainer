import { CardSlideShow } from "@/app/ui/cards/slide/cardSlideShow";
import WordsWrapper from "@/app/ui/components/wordsWrapper";

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
