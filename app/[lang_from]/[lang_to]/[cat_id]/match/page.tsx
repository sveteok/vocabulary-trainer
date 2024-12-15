import WordsWrapper from "@/app/ui/components/wordsWrapper";
import { MemoryCards } from "@/app/ui/cards/match/memoryCards";

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
