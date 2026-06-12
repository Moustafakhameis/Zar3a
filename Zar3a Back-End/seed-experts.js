import 'dotenv/config';
import { 
  sequelize, 
  User, 
  AgroExpertProfile, 
  ExpertListing,
  FarmerProfile,
  SupplierProfile,
  BuyerProfile 
} from './src/models/index.js';
import { hashPassword } from './src/utils/auth.js';

const rawPhoneNumbers = [
  '01002538471', '01123659804', '01287410953', '01539824716', '01067382154',
  '01192654708', '01205418367', '01578234901', '01034761258', '01156982374',
  '01278413502', '01563782054', '01095283617', '01138574029', '01261957438',
  '01547928316', '01076254913', '01182407635', '01250638724', '01593172548',
  '01026583974', '01134751286', '01248962351', '01561782349', '01015873642',
  '01172905463', '01296384105', '01527450639', '01041869732', '01158230974',
  '01150283764', '01276831502', '01563987201', '01041892735', '01130475826',
  '01258716304', '01576142893', '01023954678', '01187420563', '01209386145',
  '01532695708', '01057128463', '01146801735', '01273569028', '01590273641',
  '01018475263', '01162798350', '01235019487', '01547628109', '01082014653',
  '01173925406', '01206813927', '01551368720', '01039475261', '01162185397',
  '01204758123', '01583529467', '01057938126', '01130256987', '01276481309'
];
const phoneNumbers = rawPhoneNumbers.map(num => `2${num}`);

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    // 1. Core Users (Admin, original Farmers, Suppliers, Buyers)
    const usersToSeed = [
      {
        id: 10,
        fullName: 'Zar3a Admin',
        username: 'admin',
        email: 'admin@gmail.com',
        phone: '201503933299',
        role: 'ADMIN',
        isApproved: true,
        isVerified: true,
        isActive: true,
      },
      {
        id: 6,
        fullName: 'Ahmed Mansour',
        username: 'ahmed9',
        email: 'farmer1@gmail.com',
        phone: '201111111111',
        role: 'FARMER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        farmerProfile: {
          farmSize: '5 Feddans',
          soilType: 'Sandy Clay',
          location: 'Beheira',
        }
      },
      {
        id: 22,
        fullName: 'Mostafa Hegazi',
        username: 'farmer123',
        email: 'farmer2@gmail.com',
        phone: '201111111112',
        role: 'FARMER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        farmerProfile: {
          farmSize: '10 Feddans',
          soilType: 'Clay',
          location: 'Sinai',
        }
      },
      {
        id: 23,
        fullName: 'Fatma Ezzat',
        username: 'fatma_ezzat',
        email: 'farmer3@gmail.com',
        phone: '201111111113',
        role: 'FARMER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        farmerProfile: {
          farmSize: '3 Feddans',
          soilType: 'Silt',
          location: 'Gharbia',
        }
      },
      {
        id: 11,
        fullName: 'Ahmed Supplier',
        username: 'ahmed',
        email: 'supplier1@gmail.com',
        phone: '202222222221',
        role: 'SUPPLIER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        supplierProfile: {
          tradeLicense: 'LIC-998877',
          location: 'Cairo',
        }
      },
      {
        id: 21,
        fullName: 'Belal AgriTrade',
        username: 'ahmedsupplier',
        email: 'supplier2@gmail.com',
        phone: '202222222222',
        role: 'SUPPLIER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        supplierProfile: {
          tradeLicense: 'LIC-554433',
          location: 'Alexandria',
        }
      },
      {
        id: 24,
        fullName: 'Sherif Chemicals',
        username: 'sherif_agro',
        email: 'supplier3@gmail.com',
        phone: '202222222223',
        role: 'SUPPLIER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        supplierProfile: {
          tradeLicense: 'LIC-112233',
          location: 'Giza',
        }
      },
      {
        id: 31,
        fullName: 'Nile Markets Ltd',
        username: 'buyer1',
        email: 'buyer1@gmail.com',
        phone: '203333333331',
        role: 'BUYER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        buyerProfile: {
          companyName: 'Nile Markets Ltd',
          businessType: 'Wholesale Distributor',
          location: 'Cairo',
        }
      },
      {
        id: 32,
        fullName: 'Delta Foods',
        username: 'buyer2',
        email: 'buyer2@gmail.com',
        phone: '203333333332',
        role: 'BUYER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        buyerProfile: {
          companyName: 'Delta Foods Co.',
          businessType: 'Food Processing Plant',
          location: 'Alexandria',
        }
      }
    ];

    // Programmatically replace email domains and update phone numbers for core users
    for (let i = 0; i < usersToSeed.length; i++) {
      if (usersToSeed[i].email) {
        usersToSeed[i].email = usersToSeed[i].email.replace('@gmail.com', '@gmail.com');
      }
      if (i > 0) {
        usersToSeed[i].phone = phoneNumbers[i - 1];
      }
    }

    // 2. Define the 20 Agro Experts (IDs 41 to 60)
    const expertsToSeed = [
      {
        id: 41,
        fullName: 'Dr. Ahmed Salem',
        username: 'ahmed_salem',
        email: 'dr.salem@gmail.com',
        phone: '204444444441',
        expertProfile: {
          academicDegree: 'PhD in Soil Science',
          experienceYears: 15,
          bio: 'Specializes in smart irrigation systems and soil salinity management.',
        },
        expertListing: {
          title: 'Soil & Irrigation Specialist',
          specialty: 'Soil Science & Irrigation',
          description: 'Specializes in smart irrigation systems and soil salinity management for desert environments. 15 years of consulting experience.',
          hourlyRate: 220,
          location: 'Cairo',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 42,
        fullName: 'Eng. Sarah Younis',
        username: 'sarah_younis',
        email: 'eng.sarah@gmail.com',
        phone: '204444444442',
        expertProfile: {
          academicDegree: 'MSc in Plant Pathology',
          experienceYears: 8,
          bio: 'Expert in greenhouse crop diseases and biological control.',
        },
        expertListing: {
          title: 'Plant Pathology Expert',
          specialty: 'Plant Pathology',
          description: 'Expert in identifying and treating fungal and viral diseases in greenhouse crops. Focuses on eco-friendly, organic crop protection.',
          hourlyRate: 180,
          location: 'Alexandria',
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 43,
        fullName: 'Prof. Mohamed Ali',
        username: 'mohamed_ali',
        email: 'prof.mohamed@gmail.com',
        phone: '204444444443',
        expertProfile: {
          academicDegree: 'PhD in Agronomy',
          experienceYears: 20,
          bio: 'Consultant for vertical farming and hydroponic systems.',
        },
        expertListing: {
          title: 'Hydroponics Consultant',
          specialty: 'Hydroponics & Vertical Farming',
          description: 'Pioneer in vertical farming and nutrient film technique (NFT) systems in Egypt. Consults on system design and crop nutrient management.',
          hourlyRate: 300,
          location: 'Giza',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 44,
        fullName: 'Dr. Layla Mahmoud',
        username: 'layla_mahmoud',
        email: 'dr.layla@gmail.com',
        phone: '204444444444',
        expertProfile: {
          academicDegree: 'PhD in Organic Agriculture',
          experienceYears: 12,
          bio: 'Specialist in organic pest control, crop rotation, and bio-fertilizers.',
        },
        expertListing: {
          title: 'Organic Farming Advisor',
          specialty: 'Organic Agriculture',
          description: 'Specialist in organic pest control, crop rotation, and bio-fertilizers. Certified Organic Auditor helping farms transition to fully sustainable models.',
          hourlyRate: 250,
          location: 'Cairo',
          imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 45,
        fullName: 'Eng. Tarek Hassan',
        username: 'tarek_hassan',
        email: 'eng.tarek@gmail.com',
        phone: '204444444445',
        expertProfile: {
          academicDegree: 'MSc in Agricultural Engineering',
          experienceYears: 10,
          bio: 'Designs and optimizes automated climate control systems for greenhouses.',
        },
        expertListing: {
          title: 'Greenhouse Tech Specialist',
          specialty: 'Agricultural Engineering',
          description: 'Designs and optimizes automated climate control systems for greenhouses. Expert in precision farming technology and high-yield indoor management.',
          hourlyRate: 200,
          location: 'Giza',
          imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 46,
        fullName: 'Dr. Mona Abdelrahman',
        username: 'mona_abdelrahman',
        email: 'dr.mona@gmail.com',
        phone: '204444444446',
        expertProfile: {
          academicDegree: 'PhD in Agri-Tech',
          experienceYears: 7,
          bio: 'Expert in soil moisture sensors, satellite crop monitoring, and data-driven farming.',
        },
        expertListing: {
          title: 'Smart Farming & IoT Expert',
          specialty: 'Smart Agriculture & IoT',
          description: 'Expert in soil moisture sensors, satellite crop monitoring, and data-driven farming. Fuses data science with agronomy to maximize yield and optimize resource utilization.',
          hourlyRate: 280,
          location: 'Mansoura',
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 47,
        fullName: 'Eng. Khaled Youssef',
        username: 'khaled_youssef',
        email: 'eng.khaled@gmail.com',
        phone: '204444444447',
        expertProfile: {
          academicDegree: 'BSc in Fisheries & Aquaculture',
          experienceYears: 9,
          bio: 'Consultant for integrated agri-aquaculture and commercial aquaponic setups.',
        },
        expertListing: {
          title: 'Aquaponics Consultant',
          specialty: 'Aquaculture & Aquaponics',
          description: 'Consultant for integrated agri-aquaculture, commercial aquaponics setups, and water conservation. Designs ecosystem-based farming solutions that save 90% water.',
          hourlyRate: 190,
          location: 'Fayoum',
          imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 48,
        fullName: 'Dr. Youssef Fayed',
        username: 'youssef_fayed',
        email: 'dr.fayed@gmail.com',
        phone: '204444444448',
        expertProfile: {
          academicDegree: 'PhD in Horticulture',
          experienceYears: 14,
          bio: 'Expert in olive, grape, and citrus orchard management.',
        },
        expertListing: {
          title: 'Orchard & Pomology Consultant',
          specialty: 'Horticulture & Fruits',
          description: 'Expert in olive, grape, and citrus orchard management. Consults on orchard layout, pruning systems, drip fertilization, and pest management.',
          hourlyRate: 240,
          location: 'Ismailia',
          imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 49,
        fullName: 'Eng. Nadia Soliman',
        username: 'nadia_soliman',
        email: 'eng.nadia@gmail.com',
        phone: '204444444449',
        expertProfile: {
          academicDegree: 'MSc in Horticulture',
          experienceYears: 6,
          bio: 'Specialist in commercial cut-flower greenhouses and landscape design.',
        },
        expertListing: {
          title: 'Floriculture & Landscaping Specialist',
          specialty: 'Horticulture & Landscape',
          description: 'Specialist in commercial cut-flower greenhouses and landscape design. Expert in high-tech climate control for roses, carnations, and lilies.',
          hourlyRate: 170,
          location: 'Giza',
          imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 50,
        fullName: 'Prof. Ibrahim Hegazi',
        username: 'ibrahim_hegazi',
        email: 'prof.hegazi@gmail.com',
        phone: '204444444450',
        expertProfile: {
          academicDegree: 'PhD in Entomology',
          experienceYears: 22,
          bio: 'Pest monitoring, biological insect control, and pesticide safety adviser.',
        },
        expertListing: {
          title: 'Insect Control & Entomology Prof',
          specialty: 'Entomology & Pest Control',
          description: 'Pest monitoring, biological insect control, and pesticide safety adviser. 22 years of academic research and field diagnostics across Egypt.',
          hourlyRate: 270,
          location: 'Menofia',
          imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 51,
        fullName: 'Dr. Fatma El-Sherif',
        username: 'fatma_elsherif',
        email: 'dr.fatma@gmail.com',
        phone: '204444444451',
        expertProfile: {
          academicDegree: 'PhD in Plant Genetics',
          experienceYears: 11,
          bio: 'Specializes in developing drought-resistant crop varieties for arid zones.',
        },
        expertListing: {
          title: 'Plant Genetics Researcher',
          specialty: 'Plant Genetics & Breeding',
          description: 'Specializes in developing drought-resistant crop varieties for arid zones. Expert in molecular biology, gene mapping, and marker-assisted selection.',
          hourlyRate: 260,
          location: 'Cairo',
          imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 52,
        fullName: 'Eng. Sherif Kamel',
        username: 'sherif_kamel',
        email: 'eng.sherif@gmail.com',
        phone: '204444444452',
        expertProfile: {
          academicDegree: 'BSc in Agronomy',
          experienceYears: 9,
          bio: 'Consultant for farm machinery selection, maintenance, and precision tilling.',
        },
        expertListing: {
          title: 'Farm Machinery Advisor',
          specialty: 'Agricultural Machinery',
          description: 'Consultant for farm machinery selection, maintenance, and precision tilling. Helping farm owners optimize capital expenses on tractors, harvesters, and plows.',
          hourlyRate: 160,
          location: 'Qalyubia',
          imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 53,
        fullName: 'Dr. Amira Wahby',
        username: 'amira_wahby',
        email: 'dr.wahby@gmail.com',
        phone: '204444444453',
        expertProfile: {
          academicDegree: 'PhD in Agricultural Economics',
          experienceYears: 13,
          bio: 'Conducts feasibility studies, market analysis, and financial planning for agro projects.',
        },
        expertListing: {
          title: 'Agricultural Economist',
          specialty: 'Agricultural Economics',
          description: 'Conducts feasibility studies, market analysis, and financial planning for agro projects. Expert in evaluating ROI for greenhouse and smart farming installations.',
          hourlyRate: 290,
          location: 'Cairo',
          imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 54,
        fullName: 'Eng. Amr El-Masry',
        username: 'amr_elmasry',
        email: 'eng.amr@gmail.com',
        phone: '204444444454',
        expertProfile: {
          academicDegree: 'MSc in Plant Biotechnology',
          experienceYears: 7,
          bio: 'Designs micropropagation protocols and high-throughput tissue culture labs.',
        },
        expertListing: {
          title: 'Tissue Culture Specialist',
          specialty: 'Plant Biotechnology',
          description: 'Designs micropropagation protocols and high-throughput tissue culture labs. Specializes in disease-free banana, potato, and ornamental propagation.',
          hourlyRate: 210,
          location: 'Menofia',
          imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 55,
        fullName: 'Dr. Zeinab Mansour',
        username: 'zeinab_mansour',
        email: 'dr.zeinab@gmail.com',
        phone: '204444444455',
        expertProfile: {
          academicDegree: 'PhD in Crop Physiology',
          experienceYears: 12,
          bio: 'Studies plant responses to heat stress and develops mitigation techniques.',
        },
        expertListing: {
          title: 'Crop Physiology Expert',
          specialty: 'Crop Physiology',
          description: 'Studies plant responses to heat stress and salinity. Helps growers apply crop protectants and biostimulants to build climate resilience.',
          hourlyRate: 230,
          location: 'Sohag',
          imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 56,
        fullName: 'Eng. Hani Abdelnour',
        username: 'hani_abdelnour',
        email: 'eng.hani@gmail.com',
        phone: '204444444456',
        expertProfile: {
          academicDegree: 'BSc in Agricultural Science',
          experienceYears: 8,
          bio: 'Optimizing cold chains, packaging, and sorting to minimize post-harvest losses.',
        },
        expertListing: {
          title: 'Post-Harvest Technology Expert',
          specialty: 'Post-Harvest Management',
          description: 'Optimizing cold chains, packaging, and sorting to minimize post-harvest losses. Advises on controlled atmosphere storage and export compliance.',
          hourlyRate: 180,
          location: 'Beheira',
          imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 57,
        fullName: 'Dr. Rafik Gamil',
        username: 'rafik_gamil',
        email: 'dr.rafik@gmail.com',
        phone: '204444444457',
        expertProfile: {
          academicDegree: 'PhD in Apiculture',
          experienceYears: 16,
          bio: 'Designs modern apiaries, honey extraction lines, and queen rearing systems.',
        },
        expertListing: {
          title: 'Apiculture & Beekeeping Advisor',
          specialty: 'Apiculture & Beekeeping',
          description: 'Designs modern apiaries, honey extraction lines, and queen rearing systems. Specialty honey production and crop pollination plans.',
          hourlyRate: 150,
          location: 'Fayoum',
          imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 58,
        fullName: 'Eng. Mariam Halim',
        username: 'mariam_halim',
        email: 'eng.mariam@gmail.com',
        phone: '204444444458',
        expertProfile: {
          academicDegree: 'MSc in Geo-Information',
          experienceYears: 6,
          bio: 'Using drone imagery and multispectral sensors for early stress detection.',
        },
        expertListing: {
          title: 'Precision Agronomy & Drone Consultant',
          specialty: 'Precision Agronomy & Remote Sensing',
          description: 'Using drone imagery and multispectral sensors for early stress detection, weed mapping, and variable rate fertilization scripting.',
          hourlyRate: 260,
          location: 'Cairo',
          imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 59,
        fullName: 'Dr. Sayed Abdelhafez',
        username: 'sayed_abdelhafez',
        email: 'dr.sayed@gmail.com',
        phone: '204444444459',
        expertProfile: {
          academicDegree: 'PhD in Animal Nutrition',
          experienceYears: 15,
          bio: 'Formulating feed rations and designing biosecurity systems for animal farms.',
        },
        expertListing: {
          title: 'Livestock & Feed Consultant',
          specialty: 'Animal Nutrition & Breeding',
          description: 'Formulating feed rations and designing biosecurity systems for poultry, dairy, and beef farms. Maximizes milk and meat yields sustainably.',
          hourlyRate: 200,
          location: 'Sharkia',
          imageUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=800&auto=format&fit=crop',
        }
      },
      {
        id: 60,
        fullName: 'Eng. Osama Badawi',
        username: 'osama_badawi',
        email: 'eng.osama@gmail.com',
        phone: '204444444460',
        expertProfile: {
          academicDegree: 'BSc in Electrical Engineering',
          experienceYears: 10,
          bio: 'Designing solar-powered irrigation pumps and farm energy systems.',
        },
        expertListing: {
          title: 'Renewable Solar Energy Consultant',
          specialty: 'Farm Renewable Energy',
          description: 'Designing solar-powered irrigation pumps and off-grid farm energy systems. Fuses green technology with sustainable agricultural development.',
          hourlyRate: 220,
          location: 'New Valley',
          imageUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=800&auto=format&fit=crop',
        }
      }
    ];

    // Programmatically replace email domains and update phone numbers for experts
    for (let i = 0; i < expertsToSeed.length; i++) {
      if (expertsToSeed[i].email) {
        expertsToSeed[i].email = expertsToSeed[i].email.replace('@gmail.com', '@gmail.com');
      }
      expertsToSeed[i].phone = phoneNumbers[8 + i];
    }

    // Add Experts to general list
    for (const exp of expertsToSeed) {
      usersToSeed.push({
        id: exp.id,
        fullName: exp.fullName,
        username: exp.username,
        email: exp.email,
        phone: exp.phone,
        role: 'AGRO_EXPERT',
        isApproved: true,
        isVerified: true,
        isActive: true,
        expertProfile: exp.expertProfile,
        expertListing: exp.expertListing
      });
    }

    // 3. Generate additional Farmers (IDs 100 to 111)
    const firstNames = ['Mohamed', 'Ahmed', 'Ali', 'Hassan', 'Ibrahim', 'Mahmoud', 'Tarek', 'Mustafa', 'Amr', 'Khaled', 'Sherif', 'Hany'];
    const lastNames = ['El-Shinawy', 'Gaber', 'Abdelhady', 'Zaki', 'Selim', 'Badran', 'Gomaa', 'Fathy', 'Rashed', 'Amer', 'Zayed', 'Nofal'];
    const soilTypes = ['Sandy', 'Clay', 'Silt', 'Sandy Clay', 'Silty Clay'];
    const locations = ['Beheira', 'Gharbia', 'Menofia', 'Sharqia', 'Dakahlia', 'Fayoum', 'Minya', 'Assiut'];

    for (let i = 0; i < 12; i++) {
      const id = 100 + i;
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const username = `farmer_gen_${id}`;
      const email = `farmer_gen_${id}@gmail.com`;
      const phone = phoneNumbers[28 + i];
      const farmSize = `${Math.floor(Math.random() * 20) + 2} Feddans`;
      const soilType = soilTypes[i % soilTypes.length];
      const location = locations[i % locations.length];

      usersToSeed.push({
        id,
        fullName,
        username,
        email,
        phone,
        role: 'FARMER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        farmerProfile: {
          farmSize,
          soilType,
          location
        }
      });
    }

    // 4. Generate additional Suppliers (IDs 120 to 131)
    const supplierNames = ['AgriGrow', 'Pharaoh Fert', 'Nile Seeds', 'Delta Equip', 'Green Trade', 'Sinai Agro', 'Apex Supply', 'Wadi Trade', 'Horizon Farms', 'Al-Ahram Crops', 'Pioneer Seed', 'Modern Agro'];
    for (let i = 0; i < 12; i++) {
      const id = 120 + i;
      const tradeName = supplierNames[i % supplierNames.length];
      const firstName = firstNames[(i + 3) % firstNames.length];
      const lastName = lastNames[(i + 4) % lastNames.length];
      const fullName = `${firstName} ${lastName} (${tradeName})`;
      const username = `supplier_gen_${id}`;
      const email = `supplier_gen_${id}@gmail.com`;
      const phone = phoneNumbers[40 + i];
      const tradeLicense = `LIC-GL${id}88`;
      const location = locations[(i + 2) % locations.length];

      usersToSeed.push({
        id,
        fullName,
        username,
        email,
        phone,
        role: 'SUPPLIER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        supplierProfile: {
          tradeLicense,
          location
        }
      });
    }

    // 5. Generate additional Buyers (IDs 140 to 152)
    const companyTypes = ['Wholesale Distributor', 'Supermarket Chain', 'Food Processing Plant', 'Exporter', 'Agro-Processor'];
    for (let i = 0; i < 13; i++) {
      const id = 140 + i;
      const compName = `${lastNames[i % lastNames.length]} AgroFoods`;
      const firstName = firstNames[(i + 6) % firstNames.length];
      const lastName = lastNames[(i + 7) % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const username = `buyer_gen_${id}`;
      const email = `buyer_gen_${id}@gmail.com`;
      const phone = (52 + i < phoneNumbers.length) ? phoneNumbers[52 + i] : `201599999${id}`;
      const businessType = companyTypes[i % companyTypes.length];
      const location = locations[(i + 4) % locations.length];

      usersToSeed.push({
        id,
        fullName,
        username,
        email,
        phone,
        role: 'BUYER',
        isApproved: true,
        isVerified: true,
        isActive: true,
        buyerProfile: {
          companyName: compName,
          businessType,
          location
        }
      });
    }

    const emails = usersToSeed.map(u => u.email);
    const usernames = usersToSeed.map(u => u.username);
    const idsToSeed = usersToSeed.map(u => u.id);

    // 6. Clean up existing records to prevent conflicts
    console.log('🗑  Cleaning up existing users, profiles, and listings...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Clear associated profiles/listings for target IDs
    await FarmerProfile.destroy({ where: { userId: idsToSeed } });
    await AgroExpertProfile.destroy({ where: { userId: idsToSeed } });
    await SupplierProfile.destroy({ where: { userId: idsToSeed } });
    await BuyerProfile.destroy({ where: { userId: idsToSeed } });
    await ExpertListing.destroy({ where: { userId: idsToSeed } });

    const existingUsers = await User.findAll({ 
      where: {
        [sequelize.Sequelize.Op.or]: [
          { email: emails },
          { username: usernames },
          { id: idsToSeed }
        ]
      }
    });

    const existingUserIds = existingUsers.map(u => u.id);
    if (existingUserIds.length > 0) {
      await FarmerProfile.destroy({ where: { userId: existingUserIds } });
      await AgroExpertProfile.destroy({ where: { userId: existingUserIds } });
      await SupplierProfile.destroy({ where: { userId: existingUserIds } });
      await BuyerProfile.destroy({ where: { userId: existingUserIds } });
      await ExpertListing.destroy({ where: { userId: existingUserIds } });
      
      for (const exp of existingUsers) {
        await exp.destroy();
      }
    }
    console.log(`✅ Cleaned up ${existingUsers.length} existing user records and their profiles.`);

    // 7. Hash password
    const hashed = await hashPassword('password123');

    // 8. Create new users and their associated records
    console.log('🌱 Seeding database...');
    let agroExpertCount = 0;
    let expertListingCount = 0;

    for (const data of usersToSeed) {
      const { expertProfile, expertListing, farmerProfile, supplierProfile, buyerProfile, ...userData } = data;
      
      // Create user
      const user = await User.create({
        ...userData,
        passwordHash: userData.role === 'ADMIN' ? await hashPassword('admin123') : hashed,
      });

      // Create role-specific profiles
      if (user.role === 'AGRO_EXPERT' && expertProfile) {
        agroExpertCount++;
        await AgroExpertProfile.create({
          userId: user.id,
          ...expertProfile
        });
        if (expertListing) {
          expertListingCount++;
          await ExpertListing.create({
            userId: user.id,
            ...expertListing,
            isVerified: true
          });
        }
      } else if (user.role === 'FARMER' && farmerProfile) {
        await FarmerProfile.create({
          userId: user.id,
          ...farmerProfile
        });
      } else if (user.role === 'SUPPLIER' && supplierProfile) {
        await SupplierProfile.create({
          userId: user.id,
          ...supplierProfile
        });
      } else if (user.role === 'BUYER' && buyerProfile) {
        await BuyerProfile.create({
          userId: user.id,
          ...buyerProfile
        });
      }
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`\n✅ Seeding complete!`);
    console.log(`   Total Users Seeded: ${usersToSeed.length}`);
    console.log(`   Agro Experts Seeded: ${agroExpertCount}`);
    console.log(`   Expert Cards (Listings) Seeded: ${expertListingCount}`);
    process.exit(0);
  } catch (err) {
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (_) {}
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
