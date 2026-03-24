import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import dbConnect from '@/lib/db';
import About from '@/models/About';

export async function GET() {
  try {
    await dbConnect();
    let about = await About.findOne();
    
    // Create default with current static content if not exists or if it's a new empty object
    if (!about || (about.experience.length === 0 && !about.bioParagraph1)) {
      const defaultData = {
        name: 'Gamaelle Charles',
        tagline: 'Junior at Babson College | Fidelity Scholar | MLT Fellow | GWI SIP ’25',
        bioTitle: 'About Me',
        bioParagraph1: 'Finance student passionate about fair and free markets, civil duty, and investment banking/private equity with hands-on internship experience in private credit analysis and equity research.',
        bioParagraph2: 'Developing expertise in financial modeling (DCF, LBO, pro forma), due diligence, and transaction analysis through professional experience and coursework. Fellow at Management Leadership for Tomorrow (MLT) and Girls Who Invest (GWI).',
        email: 'gamaellechar123@gmail.com',
        resumeUrl: '/assets/gamaelle-charles-resume.pdf',
        profileImage: '/assets/gamaelle-charles.png',
        bannerImage: '/assets/charles-banner.png',
        contactDescription: "Have a question or feedback on my model, or just want to say hello? Feel free to reach out! I'm always open to discussing new ideas and collaborations.",
        experience: [
          { role: 'Private Credit Analyst', company: 'TPG Twin Brook Capital Partners', period: 'Jul 2025 - Aug 2025', desc: 'Incoming Summer Intern. Focusing on private credit analysis.' },
          { role: 'Fall Analyst', company: 'Thresher Fixed', period: 'Sep 2024 - May 2025', desc: 'Remote internship. Conducting fixed income research and analysis.' },
          { role: 'Finance Analyst', company: 'Charles River Development', period: 'Jul 2022 - Aug 2022', desc: 'Gained experience in financial operations and creative problem solving.' },
          { role: 'Client Solutions', company: 'State Street Global Advisors', period: 'Jul 2021 - Aug 2021', desc: 'Learned about client services and learning management systems.' }
        ],
        education: [
          { degree: 'Finance, General', school: 'The London School of Economics (LSE)', year: '2025 - 2026' },
          { degree: 'BS Accounting & Finance', school: 'Babson College', year: '2023 - 2027' },
          { degree: 'Career Prep Fellow', school: 'Management Leadership for Tomorrow', year: '2024 - 2025' },
          { degree: 'High School Diploma', school: 'Boston Latin Academy', year: '2019 - 2023' }
        ]
      };

      if (!about) {
        about = await About.create(defaultData);
      } else {
        // Update existing empty-ish doc with defaults
        about = await About.findByIdAndUpdate(about._id, defaultData, { new: true });
      }
    }
    
    return NextResponse.json(about);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    let about = await About.findOne();
    if (about) {
      about = await About.findByIdAndUpdate(about._id, { ...body, updatedAt: Date.now() }, { new: true });
    } else {
      about = await About.create(body);
    }
    
    revalidatePath('/about');
    revalidateTag('about', 'default');
    
    return NextResponse.json(about);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
