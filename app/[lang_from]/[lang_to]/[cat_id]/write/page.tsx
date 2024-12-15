import WordsWrapper from "@/app/ui/components/wordsWrapper";
import { WriteCards } from "@/app/ui/cards/write/writeCards";

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
