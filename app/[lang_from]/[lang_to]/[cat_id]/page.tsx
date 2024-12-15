import WordList from "@/app/ui/list/wordList";
import WordsWrapper from "@/app/ui/components/wordsWrapper";

export default async function WordPairListPageListPage({
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
