import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { NavBar } from './components/NavBar';
import { PostCard } from './components/PostCard';
import { supabase } from './lib/supabase';
import { postSchema } from './lib/validation';

function Board() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', imageUrl: '' });
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    const { data, error: queryError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!queryError) setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
    const channel = supabase
      .channel('posts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const submitPost = async (e) => {
    e.preventDefault();
    setError('');
    const sanitized = {
      title: DOMPurify.sanitize(form.title.trim()),
      body: DOMPurify.sanitize(form.body.trim()),
      imageUrl: form.imageUrl.trim()
    };

    const validation = postSchema.safeParse(sanitized);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid input');
      return;
    }

    const { error: insertError } = await supabase.from('posts').insert({
      title: sanitized.title,
      body: sanitized.body,
      image_url: sanitized.imageUrl || null,
      flagged: false
    });

    if (insertError) setError(insertError.message);
    setForm({ title: '', body: '', imageUrl: '' });
  };

  const flagPost = async (id) => {
    await supabase.from('posts').update({ flagged: true }).eq('id', id);
  };

  return (
    <main className="max-w-5xl mx-auto px-3 pb-8">
      <section className="glass rounded-xl p-4 mb-4">
        <h2 className="text-lg font-bold mb-3">Post</h2>
        <form onSubmit={submitPost} className="grid gap-2">
          <input className="bg-slate-800/80 rounded p-2" placeholder="Thread title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="bg-slate-800/80 rounded p-2 min-h-28" placeholder="Content" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          <input className="bg-slate-800/80 rounded p-2" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          {error ? <p className="text-red-400 text-sm">{error}</p> : null}
          <button className="bg-neon text-slate-950 font-semibold py-2 rounded">Submit</button>
        </form>
      </section>
      <section className="grid gap-3">
        {posts.map((post) => <PostCard key={post.id} post={post} onFlag={flagPost} canModerate={false} />)}
      </section>
    </main>
  );
}

function Admin() {
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.from('posts').select('*').eq('flagged', true).order('created_at', { ascending: false }).then(({ data }) => setPosts(data || []));
  }, [session]);

  const isModerator = useMemo(() => ['admin', 'moderator'].includes(session?.user?.user_metadata?.role), [session]);

  const signIn = async () => {
    const email = prompt('Admin email');
    const password = prompt('Password');
    if (email && password) await supabase.auth.signInWithPassword({ email, password });
  };

  const resolveFlag = async (id) => {
    await supabase.from('posts').update({ flagged: false }).eq('id', id);
    setPosts((p) => p.filter((x) => x.id !== id));
  };

  if (!session) {
    return <main className="max-w-2xl mx-auto p-4"><section className="glass p-6 rounded-xl"><h2 className="text-xl mb-2">Moderator Login</h2><button className="bg-neon text-slate-900 px-4 py-2 rounded" onClick={signIn}>Sign In</button></section></main>;
  }

  if (!isModerator) return <Navigate to="/" replace />;

  return (
    <main className="max-w-5xl mx-auto px-3 pb-8">
      <section className="glass rounded-xl p-4 mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Flag Queue</h2>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-slate-300 hover:text-neon">Sign out</button>
      </section>
      <section className="grid gap-3">
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} onFlag={() => {}} canModerate />
            <button onClick={() => resolveFlag(post.id)} className="text-sm mt-2 px-3 py-1 rounded bg-emerald-500/80">Resolve</button>
          </div>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,rgba(20,241,217,0.15),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(130,90,255,0.2),transparent_35%)]">
      <NavBar />
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}
