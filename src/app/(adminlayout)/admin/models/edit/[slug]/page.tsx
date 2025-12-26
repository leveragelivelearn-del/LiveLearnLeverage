import { notFound } from "next/navigation"
import { ModelForm } from "@/components/admin/ModelForm"
import dbConnect from "@/lib/db"
import Model from "@/models/Model"

interface EditModelPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditModelPage(props: EditModelPageProps) {
  const params = await props.params;
  await dbConnect()
  
  const model = await Model.findOne({ slug: params.slug }).lean()
  
  if (!model) {
    notFound()
  }
  
  // Convert _id and dates to string for serialization
  const serializedModel = JSON.parse(JSON.stringify(model))

  return <ModelForm initialData={serializedModel} isEdit={true} />
}
