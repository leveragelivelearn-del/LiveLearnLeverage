import React from 'react';
import dbConnect from "@/lib/db";
import Settings from '@/models/settings';
import FAQClient from './FAQClient';

// Enable ISR with 1 hour revalidation
export const revalidate = 300;

async function getFAQs() {
  try {
    await dbConnect();
    const settings = await Settings.findOne().lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (settings as any)?.faqs || [];
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return [];
  }
}

const FAQSection = async () => {
  const faqs = await getFAQs();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedFaqs = JSON.parse(JSON.stringify(faqs));

  return (
    <FAQClient faqs={serializedFaqs} />
  );
};

export default FAQSection;