/** a + <em>em</em> + b — sözlükteki vurgulu başlık parçaları */
export function EmTitle({ parts }: { parts: { a: string; em: string; b?: string } }) {
  return (
    <>
      {parts.a}
      <em className="text-flores-300">{parts.em}</em>
      {parts.b}
    </>
  );
}
