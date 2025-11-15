import type { Sector } from '@prisma/client'

// 業界ラベル（セクター）
export const SECTOR_LABELS: Record<Sector, string> = {
  FOOD_SERVICE: 'Food & Restaurants',
  ACCOMMODATION: 'Hotels & Lodging',
  RETAIL: 'Retail & Sales',
  SERVICE: 'General Services',
} as const

export const SECTORS = Object.keys(SECTOR_LABELS) as Sector[]

// 業種データ（sector → business types）
export const BUSINESS_TYPES: Record<Sector, string[]> = {
  FOOD_SERVICE: [
    'Cafe & Coffee Shop',
    'Restaurant & Dining',
    'Fast Food',
    'Bar & Pub',
    'Food Truck',
    'Bakery & Pastry',
    'Ice Cream Shop',
    'Bubble Tea Shop',
    'Pizza Place',
    'Sushi Restaurant',
  ],
  ACCOMMODATION: ['Hotel', 'Hostel', 'Bed & Breakfast', 'Resort', 'Vacation Rental', 'Motel'],
  RETAIL: [
    'Convenience Store',
    'Supermarket & Grocery',
    'Clothing & Apparel',
    'Electronics Store',
    'Pharmacy',
    'Gift & Souvenir Shop',
    'Bookstore',
    'Sports & Outdoor Store',
  ],
  SERVICE: [
    'Cleaning Services',
    'Delivery & Courier',
    'Reception & Front Desk',
    'Security',
    'Moving & Storage',
    'Pet Care',
    'Car Wash',
    'Laundry Service',
  ],
} as const

// 職種データ（business type → job titles）
export const JOB_TITLES: Record<string, string[]> = {
  // FOOD_SERVICE
  'Cafe & Coffee Shop': ['Barista', 'Cashier', 'Kitchen Staff', 'Shift Supervisor', 'Store Manager'],
  'Restaurant & Dining': ['Server', 'Host/Hostess', 'Busser', 'Kitchen Helper', 'Line Cook', 'Dishwasher', 'Manager'],
  'Fast Food': ['Crew Member', 'Cashier', 'Kitchen Staff', 'Drive-Thru Operator', 'Shift Lead'],
  'Bar & Pub': ['Bartender', 'Server', 'Barback', 'Security', 'Manager'],
  'Food Truck': ['Cook', 'Cashier', 'Food Prep', 'Driver'],
  'Bakery & Pastry': ['Baker', 'Pastry Chef', 'Decorator', 'Cashier', 'Sales Associate'],
  'Bubble Tea Shop': ['Bubble Tea Maker', 'Cashier', 'Prep Staff', 'Shift Lead'],

  // ACCOMMODATION
  Hotel: ['Front Desk Agent', 'Housekeeper', 'Bellhop', 'Concierge', 'Maintenance', 'Night Auditor'],
  Hostel: ['Reception Staff', 'Cleaner', 'Night Manager', 'Tour Coordinator'],
  'Bed & Breakfast': ['Front Desk Staff', 'Housekeeper', 'Breakfast Cook', 'Groundskeeper'],
  Resort: ['Guest Services', 'Activities Coordinator', 'Maintenance', 'Spa Attendant', 'Restaurant Staff'],

  // RETAIL
  'Convenience Store': ['Cashier', 'Stock Clerk', 'Night Shift Staff', 'Assistant Manager'],
  'Supermarket & Grocery': [
    'Cashier',
    'Stocker',
    'Deli Counter Staff',
    'Bakery Assistant',
    'Cart Attendant',
    'Customer Service',
  ],
  'Clothing & Apparel': ['Sales Associate', 'Cashier', 'Stock Room Associate', 'Visual Merchandiser', 'Store Manager'],

  // SERVICE
  'Cleaning Services': ['Office Cleaner', 'Residential Cleaner', 'Window Cleaner', 'Carpet Cleaner'],
  'Delivery & Courier': ['Food Delivery Driver', 'Package Delivery', 'Bike Courier', 'Warehouse Helper'],
  'Reception & Front Desk': ['Receptionist', 'Administrative Assistant', 'Customer Service Rep'],
} as const
