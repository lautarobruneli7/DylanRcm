export function LoadMore({ remaining, onClick }: { remaining: number; onClick: () => void }) {
  return (
    <div className="mt-10 flex justify-center">
      <button type="button" onClick={onClick} className="btn-ghost">Ver más ({remaining})</button>
    </div>
  );
}
