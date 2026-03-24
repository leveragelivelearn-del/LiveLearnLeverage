import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, required: true },
  desc: { type: String },
});

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  school: { type: String, required: true },
  year: { type: String, required: true },
});

const AboutSchema = new mongoose.Schema({
  name: { type: String, default: 'Gamaelle Charles' },
  tagline: { type: String, default: 'Junior at Babson College | Fidelity Scholar | MLT Fellow | GWI SIP ’25' },
  bioTitle: { type: String, default: 'About Me' },
  bioParagraph1: { type: String, default: '' },
  bioParagraph2: { type: String, default: '' },
  email: { type: String, default: 'gamaellechar123@gmail.com' },
  resumeUrl: { type: String, default: '/assets/gamaelle-charles-resume.pdf' },
  profileImage: { type: String, default: '/assets/gamaelle-charles.png' },
  bannerImage: { type: String, default: '/assets/charles-banner.png' },
  contactDescription: { type: String, default: "Have a question or feedback on my model, or just want to say hello? Feel free to reach out! I'm always open to discussing new ideas and collaborations." },
  
  experience: [ExperienceSchema],
  education: [EducationSchema],

  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.About || mongoose.model('About', AboutSchema);
