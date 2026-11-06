/** A feed the host follows: unread posts, when it last updated, and why it could not, if it could not. */
export interface FeedSource { id: string; title: string; icon?: string; color?: string; unread?: number; updated?: string; error?: string }
/** A post: `when` is shown as given ("06/11/2026", "2 h"); `html` is the post's content, already made safe by the host. */
export interface FeedPost { id: string; title: string; feed?: string; when?: string; unread?: boolean; starred?: boolean; html?: string; link?: string }
