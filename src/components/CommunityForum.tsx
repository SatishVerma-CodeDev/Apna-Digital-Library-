import React, { useState } from 'react';
import { ForumPost, ForumReply, Student } from '../types';
import { 
  MessageSquare, ThumbsUp, Pin, Lock, Trash2, Plus, 
  Send, ShieldCheck, Tag, Sparkles, Filter, ChevronDown, CheckCircle2 
} from 'lucide-react';

interface CommunityForumProps {
  posts: ForumPost[];
  currentStudent?: Student | null;
  isAdmin?: boolean;
  onAddPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'likes' | 'replies'>) => void;
  onAddReply: (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>) => void;
  onLikePost: (postId: string) => void;
  onPinPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onLockPost?: (postId: string) => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  posts,
  currentStudent,
  isAdmin = false,
  onAddPost,
  onAddReply,
  onLikePost,
  onPinPost,
  onDeletePost,
  onLockPost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // New Post Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('UPSC CSE');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('UPSC, Prelims, Notes');

  // New Reply Text state per post
  const [replyText, setReplyText] = useState<{ [postId: string]: string }>({});

  const categories = [
    'All',
    'UPSC CSE',
    'NEET UG',
    'IIT-JEE',
    'SSC & Banking',
    'Study Tips & Resources',
    'Library Feedback',
  ];

  const filteredPosts = posts.filter(
    p => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddPost({
      title: newTitle,
      content: newContent,
      category: newCategory,
      authorId: currentStudent?.id || (isAdmin ? 'admin-01' : 'guest'),
      authorName: currentStudent?.name || (isAdmin ? 'Apna Library Admin' : 'Aspirant Student'),
      authorSeat: currentStudent?.seatNo || (isAdmin ? 'Staff Desk' : 'Seat A1'),
      authorAvatar: currentStudent?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      tags: tagsArray.length > 0 ? tagsArray : ['StudyGroup'],
      isPinned: false,
      isLocked: false,
    });

    setNewTitle('');
    setNewContent('');
    setIsCreatingPost(false);
  };

  const handleSendReply = (postId: string) => {
    const text = replyText[postId];
    if (!text || !text.trim()) return;

    onAddReply(postId, {
      postId,
      authorId: currentStudent?.id || (isAdmin ? 'admin-01' : 'guest'),
      authorName: currentStudent?.name || (isAdmin ? 'Library Administrator' : 'Fellow Aspirant'),
      authorRole: isAdmin ? 'Admin' : 'Student',
      authorAvatar: currentStudent?.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      content: text.trim(),
    });

    setReplyText(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div id="forum-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Peer Learning & Aspirants Circle</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Apna Library Community Forum
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Discuss competitive exam strategies, solve subject doubts, share PDF study notes, and collaborate with your library peers.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(!isCreatingPost)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isCreatingPost ? 'Close Form' : 'Start New Discussion'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CREATE POST MODAL / EXPANDABLE DRAWER */}
      {isCreatingPost && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 mb-8 shadow-2xl">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Create a New Forum Thread
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Earn <strong>+25 Study Points</strong> for contributing helpful discussions!
          </p>

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best resources for UPSC Modern History timeline"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Exam / Course Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="UPSC CSE">UPSC CSE</option>
                  <option value="NEET UG">NEET UG</option>
                  <option value="IIT-JEE">IIT-JEE</option>
                  <option value="SSC & Banking">SSC & Banking</option>
                  <option value="Study Tips & Resources">Study Tips & Resources</option>
                  <option value="Library Feedback">Library Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Discussion Content</label>
              <textarea
                required
                rows={4}
                placeholder="Share your detailed question, study technique, or resource recommendation..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. UPSC, GS1, Spectrum, NCERT"
                value={newTags}
                onChange={e => setNewTags(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-md"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POSTS LIST */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No discussions found in this category yet. Be the first to start a thread!
          </div>
        ) : (
          filteredPosts.map(post => {
            const isThreadExpanded = activePostId === post.id;

            return (
              <div
                key={post.id}
                className={`bg-slate-900/80 border rounded-2xl p-6 transition-all ${
                  post.isPinned
                    ? 'border-amber-400/50 bg-slate-900/90 shadow-[0_4px_20px_rgba(251,191,36,0.1)]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-amber-400/50"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{post.authorName}</span>
                        <span className="text-[10px] text-amber-300 font-mono">
                          Desk {post.authorSeat}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{post.createdAt}</span>
                    </div>
                  </div>

                  {/* Badges / Admin Controls */}
                  <div className="flex items-center gap-2">
                    {post.isPinned && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded-md border border-amber-400/30">
                        <Pin className="w-3 h-3 fill-amber-300" /> Pinned
                      </span>
                    )}

                    <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-semibold rounded-md">
                      {post.category}
                    </span>

                    {/* Admin Moderation Bar */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 ml-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {onPinPost && (
                          <button
                            onClick={() => onPinPost(post.id)}
                            title={post.isPinned ? 'Unpin' : 'Pin to Top'}
                            className="p-1 text-slate-400 hover:text-amber-400"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onLockPost && (
                          <button
                            onClick={() => onLockPost(post.id)}
                            title={post.isLocked ? 'Unlock Thread' : 'Lock Thread'}
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeletePost && (
                          <button
                            onClick={() => onDeletePost(post.id)}
                            title="Delete Post"
                            className="p-1 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-white mb-2">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-md"
                    >
                      <Tag className="w-2.5 h-2.5" /> #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions & Reply Count */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Upvotes</span>
                    </button>

                    <button
                      onClick={() => setActivePostId(isThreadExpanded ? null : post.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.replies?.length || 0} Replies</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActivePostId(isThreadExpanded ? null : post.id)}
                    className="text-amber-400 font-semibold hover:underline text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isThreadExpanded ? 'Hide Discussion' : 'View Thread'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isThreadExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* EXPANDED THREAD REPLIES */}
                {isThreadExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                      Discussion Thread ({post.replies?.length || 0})
                    </p>

                    {post.replies?.map(rep => (
                      <div
                        key={rep.id}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          rep.authorRole === 'Admin'
                            ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rep.authorAvatar}
                              alt={rep.authorName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-bold text-white text-xs">{rep.authorName}</span>
                            {rep.authorRole === 'Admin' && (
                              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{rep.createdAt}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{rep.content}</p>
                      </div>
                    ))}

                    {/* Add Reply Input */}
                    {!post.isLocked ? (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Write a helpful answer or feedback..."
                          value={replyText[post.id] || ''}
                          onChange={e =>
                            setReplyText({ ...replyText, [post.id]: e.target.value })
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSendReply(post.id);
                          }}
                          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleSendReply(post.id)}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Reply
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-300 flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        This discussion thread has been locked by administrators.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
