import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import { revalidatePath, revalidateTag } from 'next/cache'

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params
    
    const escapedSlug = escapeRegex(slug);
    const blog = await Blog.findOne({ 
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } 
    })
      .populate('author', 'name image bio')
      .lean()
    
    if (!blog || !blog.published) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } })

    // Fetch Prev/Next only if publishedAt exists
    let prevPost: any = null
    let nextPost: any = null
    
    if (blog.publishedAt) {
      [prevPost, nextPost] = await Promise.all([
        Blog.findOne({
          published: true,
          publishedAt: { $lt: blog.publishedAt }
        })
          .sort({ publishedAt: -1 })
          .select('title slug')
          .lean(),
    
        Blog.findOne({
          published: true,
          publishedAt: { $gt: blog.publishedAt }
        })
          .sort({ publishedAt: 1 })
          .select('title slug')
          .lean(),
      ])
    }
  
    // Build related posts query carefully
    const orConditions: any[] = []
    if (blog.category) {
      orConditions.push({ category: blog.category })
    }
    if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
      orConditions.push({ tags: { $in: blog.tags } })
    }

    let relatedPosts: any[] = []
    if (orConditions.length > 0) {
      relatedPosts = await Blog.find({
        _id: { $ne: blog._id },
        published: true,
        $or: orConditions
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('author', 'name image')
        .select('title slug excerpt featuredImage tags category publishedAt readTime views author')
        .lean()
    }

    return NextResponse.json({ 
      blog,
      prevPost,
      nextPost,
      relatedPosts
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const body = await req.json();

    const escapedSlug = escapeRegex(slug);
    const existingBlog = await Blog.findOne({ 
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } 
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Check ownership or admin role
    const isOwner = existingBlog.author && session.user.id === existingBlog.author.toString();
    if (session.user.role !== 'admin' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: existingBlog._id },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (updatedBlog) {
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${updatedBlog.slug}`);
      revalidateTag('blogs', 'default');
      revalidateTag(`blog-${updatedBlog.slug}`, 'default');
    }

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;

    const escapedSlug = escapeRegex(slug);
    const existingBlog = await Blog.findOne({ 
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } 
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const isOwner = existingBlog.author && session.user.id === existingBlog.author.toString();
    if (session.user.role !== 'admin' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Blog.findByIdAndDelete(existingBlog._id);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidateTag('blogs', 'default');
    revalidateTag(`blog-${slug}`, 'default');

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}