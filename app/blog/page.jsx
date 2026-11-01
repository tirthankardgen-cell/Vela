import {publicMetadata} from '@/src/lib/site';
import {posts} from '@/src/lib/blog';
import ContentPage from '@/src/marketing/ContentPage';
import BlogCard from '@/src/marketing/BlogCard';
const title='Interior planning guides & Vela blog';
const description='Practical guides to measuring rooms, arranging small living spaces, planning flats, tracing floor plans and exporting your Vela design.';
export const metadata=publicMetadata(title,description,'/blog');
export default function Blog(){return <ContentPage title={title} description={description} path="/blog" type="CollectionPage" kicker="VELA / THE PLANNING JOURNAL"><div className="blog-grid">{posts.map(post=><BlogCard post={post} key={post.slug}/>)}</div><p className="content-note">Interior images are AI-created inspiration, not Vela renderings. The guides describe concept planning and the current product preview.</p></ContentPage>;}
