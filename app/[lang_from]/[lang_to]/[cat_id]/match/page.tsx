import WordsWrapper from "@/ui/basis/wordsWrapper";
import { MemoryCards } from "@/ui/cards/match/memoryCards";

export default async function MatchPage({
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
      <MemoryCards />
    </WordsWrapper>
  );
}
