import { notFound } from "next/navigation"
import { BlogPostForm } from "@/components/admin/BlogPostForm"
import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

interface EditBlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditBlogPage(props: EditBlogPageProps) {
  const params = await props.params;
  await dbConnect()
  
  const post = await Blog.findOne({ slug: params.slug }).lean()
  
  if (!post) {
    notFound()
  }
  
  // Convert _id and dates to string for serialization
  const serializedPost = JSON.parse(JSON.stringify(post))

  return <BlogPostForm initialData={serializedPost} isEdit={true} />
}
