import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'
import { revalidatePath, revalidateTag } from 'next/cache'

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params;

    const escapedSlug = escapeRegex(slug);
    const model = await Model.findOne({
      slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") }
    }).lean()

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await Model.updateOne({ _id: model._id }, { $inc: { views: 1 } })

    // Get related models (same industry or similar deal size)
    const relatedModels = await Model.find({
      _id: { $ne: model._id },
      $or: [{ industry: model.industry }, { dealType: model.dealType }],
    })
      .sort({ completionDate: -1 })
      .limit(3)
      .select(
        "title slug description dealSize currency industry dealType completionDate views featured slides"
      )
      .lean();

    return NextResponse.json({ model, relatedModels })
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const body = await req.json();

    const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
    const escapedSlug = escapeRegex(slug);

    // Fetch model to check ownership/roles
    let existingModel;
    if (isObjectId) {
      existingModel = await Model.findById(slug);
    } else {
      existingModel = await Model.findOne({ slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } });
    }

    if (!existingModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    const isOwner = existingModel.userId && session.user.id === existingModel.userId.toString();
    if (session.user.role !== 'admin' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allowedFields = ['title', 'slug', 'description', 'status', 'dealSize', 'currency', 'industry', 'dealType', 'completionDate', 'excelFileUrl', 'pdfFileUrl', 'slides', 'keyMetrics', 'featured'];
    const sanitizedBody: any = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        sanitizedBody[key] = value;
      }
    }

    let model;
    if (isObjectId) {
      model = await Model.findByIdAndUpdate(slug, sanitizedBody, {
        new: true,
        runValidators: true,
      });
    } else {
      model = await Model.findOneAndUpdate({ slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } }, sanitizedBody, {
        new: true,
        runValidators: true,
      });
    }

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.slug) {
      revalidatePath(`/models/${model.slug}`);
      revalidateTag(`model-${model.slug}`, 'default');
    }

    return NextResponse.json({ model });
  } catch (error) {
    console.error("Error updating model:", error);
    return NextResponse.json({ error: 'Failed to update model' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;

    const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
    const escapedSlug = escapeRegex(slug);

    let existingModel;
    if (isObjectId) {
      existingModel = await Model.findById(slug);
    } else {
      existingModel = await Model.findOne({ slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } });
    }

    if (!existingModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    const isOwner = existingModel.userId && session.user.id === existingModel.userId.toString();
    if (session.user.role !== 'admin' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let model;
    if (isObjectId) {
      model = await Model.findByIdAndDelete(slug);
    } else {
      model = await Model.findOneAndDelete({ slug: { $regex: new RegExp(`^${escapedSlug}$`, "i") } });
    }

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.slug) {
      revalidatePath(`/models/${model.slug}`);
      revalidateTag(`model-${model.slug}`, 'default');
    }

    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error("Error deleting model:", error);
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}