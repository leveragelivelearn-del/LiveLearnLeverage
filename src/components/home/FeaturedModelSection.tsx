
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Model from '@/models/Model';
import dbConnect from "@/lib/db";
import FeaturedModelClient from './FeaturedModelClient';

async function getFeaturedContent() {
  await dbConnect();

  const featuredModels = await Model.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(4)
    .select("title description slug industry dealSize dealType completionDate currency views slides featured")
    .lean();

  return {
    models: JSON.parse(JSON.stringify(featuredModels)),
  };
}

const FeaturedModelSection = async () => {
  const { models } = await getFeaturedContent();
  return (
    <div>
      <FeaturedModelClient models={models} />
    </div>
  );
};

export default FeaturedModelSection;