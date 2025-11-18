import { PrismaClient, EmploymentType, SalaryType, Job } from '@prisma/client'
import { INDUSTRY_EXPERIENCES } from '../src/constants/experiences'

const prisma = new PrismaClient()

// Vancouver coordinate ranges
const VANCOUVER_LAT_MIN = 49.2
const VANCOUVER_LAT_MAX = 49.32
const VANCOUVER_LNG_MIN = -123.25
const VANCOUVER_LNG_MAX = -123.0

// Generate random coordinates within Vancouver
function getRandomVancouverCoords(): { lat: number; lng: number } {
  const lat = VANCOUVER_LAT_MIN + Math.random() * (VANCOUVER_LAT_MAX - VANCOUVER_LAT_MIN)
  const lng = VANCOUVER_LNG_MIN + Math.random() * (VANCOUVER_LNG_MAX - VANCOUVER_LNG_MIN)
  return { lat, lng }
}

// Store names by industry
const storeNames = {
  FOOD: [
    'Starbucks Robson Street',
    'Tim Hortons Downtown',
    'White Spot Granville',
    'Cactus Club Coal Harbour',
    "Earl's Kitchen Yaletown",
  ],
  RETAIL: ['London Drugs Main', 'Best Buy Pacific Centre', 'H&M Robson', 'Zara Downtown'],
  HOSPITALITY: ['Fairmont Hotel Vancouver', 'Hyatt Regency', 'Delta Hotel'],
  HEALTHCARE: ['VGH Support Services', 'Providence Health'],
  BEAUTY: ['Sephora Robson', 'The Bay Beauty'],
  DELIVERY: ['UberEats Vancouver', 'Skip The Dishes'],
  FITNESS: ['GoodLife Fitness Downtown', 'Steve Nash Fitness'],
  LOGISTICS: ['Canada Post Vancouver', 'FedEx Distribution'],
  EDUCATION: ['UBC Continuing Studies', 'VCC Downtown'],
  CORPORATE: ['Telus Garden Office', 'RBC Corporate'],
  ADMIN: ['City of Vancouver', 'BC Government'],
  FINANCE: ['TD Bank Tower', 'BMO Financial'],
  TECH: ['Microsoft Vancouver', 'Amazon Development'],
  MARKETING: ['Hootsuite HQ', 'Lululemon Corporate'],
  MEDIA: ['CBC Vancouver', 'Global BC'],
}

// Job titles and descriptions by experience
const jobDetails: Record<string, { title: string; description: string; salaries: string[] }> = {
  // FOOD
  foodBarista: {
    title: 'Looking for experienced barista!',
    description:
      'Join our team as a friendly barista! Make amazing coffee and provide excellent customer service to our diverse clientele.',
    salaries: ['$17/hour', '$18/hour', '$19/hour'],
  },
  foodCashier: {
    title: 'Cashier Position Available',
    description:
      'We need a reliable cashier for our busy restaurant. Handle payments, greet customers, and maintain a clean workspace.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  foodServer: {
    title: 'Server Wanted - Flexible Hours',
    description:
      'Experienced server needed for fast-paced restaurant environment. Great tips and flexible scheduling available.',
    salaries: ['$15/hour + tips', '$16/hour + tips', '$17/hour + tips'],
  },
  foodCook: {
    title: 'Line Cook Position',
    description:
      'Join our kitchen team! Prepare fresh meals, maintain food safety standards, and work in a supportive team environment.',
    salaries: ['$18/hour', '$19/hour', '$20/hour'],
  },
  foodKitchenHelper: {
    title: 'Kitchen Helper Needed',
    description:
      'Entry-level position in busy kitchen. Assist with food prep, dishwashing, and maintaining clean work areas.',
    salaries: ['$15/hour', '$16/hour', '$17/hour'],
  },
  foodBaking: {
    title: 'Baker - Early Morning Shift',
    description: 'Early morning baker needed for fresh bread and pastries. Experience with commercial ovens preferred.',
    salaries: ['$19/hour', '$20/hour', '$21/hour'],
  },
  foodPastryChef: {
    title: 'Pastry Chef Assistant',
    description:
      'Creative position working with head pastry chef. Learn advanced techniques while creating beautiful desserts.',
    salaries: ['$20/hour', '$22/hour', '$24/hour'],
  },
  foodPreparation: {
    title: 'Food Prep Cook',
    description: 'Prepare ingredients for busy kitchen service. Knife skills and food safety knowledge required.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  foodBartender: {
    title: 'Bartender - Evening Shifts',
    description:
      'Experienced bartender for upscale restaurant. Mix cocktails, serve wine, and provide exceptional service.',
    salaries: ['$16/hour + tips', '$17/hour + tips', '$18/hour + tips'],
  },
  foodSommelier: {
    title: 'Wine Server/Sommelier',
    description:
      'Wine enthusiast needed for fine dining establishment. Wine knowledge and serving experience required.',
    salaries: ['$20/hour + tips', '$22/hour + tips', '$25/hour + tips'],
  },

  // RETAIL
  retailSalesAssociate: {
    title: 'Sales Associate - Customer Service',
    description: 'Help customers find products and provide excellent service in our retail environment.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  retailCashier: {
    title: 'Cashier Position',
    description: 'Process transactions and assist customers at checkout. Retail experience preferred.',
    salaries: ['$15/hour', '$16/hour', '$17/hour'],
  },
  retailCustomerService: {
    title: 'Customer Service Representative',
    description: 'Handle customer inquiries, returns, and provide product information.',
    salaries: ['$17/hour', '$18/hour', '$19/hour'],
  },
  retailMerchandising: {
    title: 'Merchandising Associate',
    description: 'Create attractive product displays and maintain store presentation standards.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  retailStockingShelves: {
    title: 'Stock Associate',
    description: 'Receive shipments, stock shelves, and maintain inventory organization.',
    salaries: ['$15/hour', '$16/hour', '$17/hour'],
  },
  retailInventoryCount: {
    title: 'Inventory Specialist',
    description: 'Conduct regular inventory counts and maintain accurate stock records.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  retailProductDisplay: {
    title: 'Visual Merchandiser',
    description: 'Design and create eye-catching product displays to drive sales.',
    salaries: ['$17/hour', '$18/hour', '$19/hour'],
  },
  retailFittingRoomStaff: {
    title: 'Fitting Room Assistant',
    description: 'Assist customers in fitting rooms and maintain dressing room cleanliness.',
    salaries: ['$15/hour', '$16/hour', '$17/hour'],
  },

  // HOSPITALITY
  hospitalityFrontDesk: {
    title: 'Front Desk Associate',
    description: 'Greet guests, handle check-ins/check-outs, and provide exceptional hospitality service.',
    salaries: ['$18/hour', '$19/hour', '$20/hour'],
  },
  hospitalityRoomAttendant: {
    title: 'Room Attendant',
    description: 'Clean and prepare guest rooms to the highest standards. Attention to detail essential.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  hospitalityGuestService: {
    title: 'Guest Service Representative',
    description: 'Assist guests with requests and ensure memorable stay experiences.',
    salaries: ['$17/hour', '$18/hour', '$19/hour'],
  },
  hospitalityHousekeeping: {
    title: 'Housekeeping Staff',
    description: 'Maintain cleanliness throughout hotel property. Physical work in team environment.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
  hospitalityLaundryStaff: {
    title: 'Laundry Attendant',
    description: 'Handle hotel linens and ensure clean, fresh bedding for guests.',
    salaries: ['$15/hour', '$16/hour', '$17/hour'],
  },
  hospitalityBanquetServer: {
    title: 'Banquet Server',
    description: 'Serve at special events and banquets. Weekend and evening availability required.',
    salaries: ['$16/hour + tips', '$17/hour + tips', '$18/hour + tips'],
  },

  // Default for remaining industries
  default: {
    title: 'Team Member Position',
    description: 'Join our growing team! We offer training, flexible hours, and opportunities for advancement.',
    salaries: ['$16/hour', '$17/hour', '$18/hour'],
  },
}

// Thumbnail URLs for different industries
const thumbnails = {
  FOOD: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=150&fit=crop&crop=center',
  ],
  RETAIL: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop&crop=center',
  ],
  HOSPITALITY: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=150&fit=crop&crop=center',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=150&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=150&fit=crop&crop=center',
  ],
}

// Type for seed job data (excludes auto-generated fields)
type SeedJob = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateJobs() {
  const jobs: SeedJob[] = []

  // Process each industry
  Object.entries(INDUSTRY_EXPERIENCES).forEach(([industry, experiences]) => {
    const industryStoreNames = storeNames[industry as keyof typeof storeNames] || [
      'Local Business',
      'Vancouver Store',
      'Downtown Location',
    ]
    const industryThumbnails = thumbnails[industry as keyof typeof thumbnails] || thumbnails.default

    // Determine number of jobs per experience type
    const jobsPerExperience = industry === 'FOOD' ? 5 : 1

    experiences.forEach((experience) => {
      for (let i = 0; i < jobsPerExperience; i++) {
        const coords = getRandomVancouverCoords()
        const details = jobDetails[experience.id] || jobDetails.default
        const storeName = industryStoreNames[i % industryStoreNames.length]
        const storeNumber = jobsPerExperience > 1 ? ` - Store ${i + 1}` : ''

        const job = {
          mstExperienceId: experience.id,
          name: `${storeName}${storeNumber}`,
          title: details.title,
          description: details.description,
          thumbnailUrl: getRandomElement(industryThumbnails),
          salary: getRandomElement(details.salaries),
          lat: coords.lat,
          lng: coords.lng,
          address: `${Math.floor(Math.random() * 9999) + 1000} ${getRandomElement([
            'Robson St',
            'Granville St',
            'Davie St',
            'Denman St',
            'Commercial Dr',
            'Main St',
            'Hastings St',
            'Broadway',
            'Kingsway',
            'Fraser St',
          ])}, Vancouver, BC`,
          salaryType: details.salaries[0].includes('hour')
            ? SalaryType.HOURLY
            : details.salaries[0].includes('month')
              ? SalaryType.MONTHLY
              : SalaryType.ANNUAL,
          employmentType: getRandomElement([
            EmploymentType.PART_TIME,
            EmploymentType.FULL_TIME,
            EmploymentType.CONTRACT,
          ]),
          isActive: true,
        }

        jobs.push(job)
      }
    })
  })

  console.log(`Generated ${jobs.length} jobs:`)
  console.log(`- FOOD industry: ${INDUSTRY_EXPERIENCES.FOOD.length * 5} jobs`)
  console.log(`- Other industries: ${jobs.length - INDUSTRY_EXPERIENCES.FOOD.length * 5} jobs`)

  return jobs
}

async function main() {
  console.log('🌱 Starting job seeding...')

  try {
    // Clear existing jobs
    console.log('🗑️  Clearing existing jobs...')
    await prisma.job.deleteMany({})

    // Generate and insert new jobs
    const jobs = generateJobs()

    console.log(`📝 Inserting ${jobs.length} jobs...`)
    await prisma.job.createMany({
      data: jobs,
    })

    console.log('✅ Job seeding completed successfully!')
    console.log(`📊 Total jobs created: ${jobs.length}`)
  } catch (error) {
    console.error('❌ Error during job seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

export default main
