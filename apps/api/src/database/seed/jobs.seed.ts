import { DataSource } from 'typeorm';
import { Job, JobType, JobLevel } from 'src/modules/jobs/job.entity';

export async function seedJobs(dataSource: DataSource) {
  const jobRepository = dataSource.getRepository(Job);

  // Verificar si ya existen datos
  const count = await jobRepository.count();
  if (count > 0) {
    console.log('Jobs data already seeded');
    return;
  }

  const sampleJobs = [
    {
      title: 'Senior Full Stack Developer',
      description:
        'We are looking for an experienced Full Stack Developer with expertise in Node.js and React. You will work on cutting-edge projects.',
      company: 'TechCorp Solutions',
      location: 'Buenos Aires, Argentina',
      job_type: JobType.FULL_TIME,
      level: JobLevel.SENIOR,
      salary_min: 80000,
      salary_max: 120000,
      currency: 'ARS',
      requirements: '5+ years of experience with Node.js and React, PostgreSQL expertise',
      benefits: 'Home office, Health insurance, Professional development',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'Python Backend Developer',
      description:
        'Join our backend team to build scalable APIs using Django and FastAPI. Work with a talented team on microservices.',
      company: 'DataDriven Inc',
      location: 'Remote',
      job_type: JobType.FULL_TIME,
      level: JobLevel.JUNIOR,
      salary_min: 50000,
      salary_max: 75000,
      currency: 'USD',
      requirements: '2+ years of Python experience, REST API knowledge',
      benefits: 'Remote work, Flexible hours, Learning budget',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'React Native Mobile Developer',
      description:
        'Build mobile applications for iOS and Android using React Native. Work on features used by millions of users.',
      company: 'MobileFirst App',
      location: 'Córdoba, Argentina',
      job_type: JobType.FULL_TIME,
      level: JobLevel.SENIOR,
      salary_min: 70000,
      salary_max: 100000,
      currency: 'ARS',
      requirements: '4+ years React Native, TypeScript, Firebase',
      benefits: 'Stock options, Gym membership, Catering',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'DevOps Engineer',
      description:
        'We need a DevOps expert to manage our cloud infrastructure on AWS. Experience with Kubernetes and CI/CD pipelines required.',
      company: 'CloudPlatform',
      location: 'Remote',
      job_type: JobType.FULL_TIME,
      level: JobLevel.SENIOR,
      salary_min: 90000,
      salary_max: 130000,
      currency: 'USD',
      requirements: 'AWS expertise, Kubernetes, Docker, Terraform',
      benefits: 'Remote, Conference attendance, Sabbatical options',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'QA Engineer',
      description:
        'Join our QA team to ensure product quality. Experience with automation testing frameworks and manual testing.',
      company: 'QualityFirst',
      location: 'CABA, Argentina',
      job_type: JobType.FULL_TIME,
      level: JobLevel.JUNIOR,
      salary_min: 45000,
      salary_max: 65000,
      currency: 'ARS',
      requirements: 'Testing frameworks (Jest, Cypress), SQL basics',
      benefits: 'Training program, Health insurance, Career growth',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'Product Manager',
      description:
        'Lead product strategy and roadmap for our SaaS platform. Work cross-functionally with engineering and design.',
      company: 'ProductCo',
      location: 'Remote',
      job_type: JobType.FULL_TIME,
      level: JobLevel.LEAD,
      salary_min: 100000,
      salary_max: 150000,
      currency: 'USD',
      requirements: 'Product management experience, Analytics, User research',
      benefits: 'Equity, Remote, Flexible PTO',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'Freelance UI/UX Designer',
      description:
        'We are looking for talented UI/UX designers for short-term project-based work. Design modern, user-friendly interfaces.',
      company: 'Creative Agency',
      location: 'Remote',
      job_type: JobType.FREELANCE,
      level: JobLevel.SENIOR,
      salary_min: 50,
      salary_max: 150,
      currency: 'USD',
      requirements: 'Figma, Adobe XD, Portfolio required',
      benefits: 'Flexible hours, Portfolio building',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
    {
      title: 'JavaScript Intern',
      description:
        'Great opportunity for aspiring developers to learn and grow. Work on real projects with experienced mentors.',
      company: 'TechBootcamp',
      location: 'Buenos Aires, Argentina',
      job_type: JobType.INTERNSHIP,
      level: JobLevel.JUNIOR,
      salary_min: 0,
      salary_max: 20000,
      currency: 'ARS',
      requirements: 'Basic JavaScript, HTML, CSS knowledge',
      benefits: 'Mentorship, Lunch provided, Learning resources',
      status: 'active',
      is_external: false,
      published_date: new Date(),
    },
  ];

  try {
    await jobRepository.insert(sampleJobs);
    console.log('✅ Jobs seeded successfully');
  } catch (error) {
    console.error('Error seeding jobs:', error);
  }
}
