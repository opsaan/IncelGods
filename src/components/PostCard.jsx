import DOMPurify from 'dompurify';

export function PostCard({ post, onFlag, canModerate }) {
  return (
    <article className="glass rounded-xl p-4 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-neon">{post.title}</h3>
        <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleString()}</span>
      </div>
      <p className="text-sm text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }} />
      {post.image_url ? (
        <img src={post.image_url} alt="Post attachment" className="max-h-72 rounded-lg border border-neon/20 object-cover" loading="lazy" />
      ) : null}
      <div className="flex justify-between text-xs text-slate-400">
        <span>#{post.id}</span>
        <button onClick={() => onFlag(post.id)} className="hover:text-red-400">Flag</button>
      </div>
      {canModerate && post.flagged ? <p className="text-xs text-amber-400">Flagged for review</p> : null}
    </article>
  );
}
