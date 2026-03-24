import { Metadata } from 'next';
import AboutContent from './AboutContent';
import { getBaseUrl } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/about`, {
      cache: 'force-cache',
      next: { tags: ['about'] }
    });
    const about = await res.json();
    return {
      title: `${about?.name || 'About Me'} | LiveLearnLeverage`,
      description: about?.bioParagraph1 || 'Finance student passionate about free markets and investment banking.',
    };
  } catch (error) {
    return {
      title: 'About | LiveLearnLeverage',
    };
  }
}

async function getAboutData() {
  const baseUrl = getBaseUrl();
  const [aboutRes, settingsRes, modelsRes, blogsRes] = await Promise.all([
    fetch(`${baseUrl}/api/about`, { cache: 'force-cache', next: { tags: ['about'] } }),
    fetch(`${baseUrl}/api/settings`, { cache: 'force-cache', next: { tags: ['settings'] } }),
    fetch(`${baseUrl}/api/models?limit=4&featured=true`, { cache: 'force-cache', next: { tags: ['models'] } }),
    fetch(`${baseUrl}/api/blog?limit=4`, { cache: 'force-cache', next: { tags: ['blogs'] } })
  ]);

  const [aboutData, settings, modelsData, blogsData] = await Promise.all([
    aboutRes.json(),
    settingsRes.json(),
    modelsRes.json(),
    blogsRes.json()
  ]);

  return {
    aboutData,
    settings,
    models: modelsData.models || [],
    blogs: blogsData.blogs || []
  };
}

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <AboutContent 
      initialAboutData={data.aboutData} 
      initialSettings={data.settings}
      initialModels={data.models}
      initialBlogs={data.blogs}
    />
  );
}