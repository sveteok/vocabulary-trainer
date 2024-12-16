import WordList from "@/ui/list/wordList";
import WordsWrapper from "@/ui/basis/wordsWrapper";

export default async function WordPairListPage({
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
      <WordList />
    </WordsWrapper>
  );
}
