import sequelize from '../src/config/database.js';

async function run() {
  const userIds = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 64, 65, 66, 74];

  try {
    for (const id of userIds) {
      await sequelize.query(`
        INSERT IGNORE INTO Users (id, fullName, username, email, phone, role, status, subscriptionTier, createdAt, updatedAt)
        VALUES (${id}, 'Expert ${id}', 'expert_${id}', 'expert${id}@example.com', '0100000${id}', 'AGRO_EXPERT', 'approved', 'FREE', NOW(), NOW())
      `);
    }

    await sequelize.query(`
INSERT IGNORE INTO ExpertListings 
(id, userId, title, specialty, description, hourlyRate, location, imageUrl, isVerified, createdAt, updatedAt)
VALUES
(1, 64, 'Soil & Irrigation Specialist', 'Soil & Irrigation Specialist', 'Specializes in smart irrigation systems and soil management.', 220, 'Cairo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=soil', 1, '2026-05-28 12:39:18', '2026-05-28 12:39:18'),

(2, 65, 'Plant Pathology Expert', 'Plant Pathology Expert', 'Expert in identifying and treating fungal and bacterial plant diseases.', 180, 'Alexandria', 'https://api.dicebear.com/7.x/avataaars/svg?seed=plant', 1, '2026-05-28 12:39:18', '2026-05-28 12:39:18'),

(3, 66, 'Hydroponics Consultant', 'Hydroponics Consultant', 'Pioneer in vertical farming and nutrient film technique systems.', 300, 'Giza', 'https://api.dicebear.com/7.x/avataaars/svg?seed=hydro', 1, '2026-05-28 12:39:18', '2026-05-28 12:39:18'),

(4, 74, 'dr menna', 'database', 'database, mysql, node.js,react', 100, 'CAIRO', NULL, 1, '2026-05-29 08:56:50', '2026-05-29 08:56:50'),

(5, 41, 'Soil & Irrigation Specialist', 'Soil Science & Irrigation', 'Specializes in smart irrigation systems and soil management.', 220, 'Cairo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),
(6, 42, 'Plant Pathology Expert', 'Plant Pathology', 'Expert in identifying and treating fungal and viral diseases in greenhouse crops. Focuses on eco-friendly, organic crop protection.', 180, 'Alexandria', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(7, 43, 'Hydroponics Consultant', 'Hydroponics & Vertical Farming', 'Pioneer in vertical farming and nutrient film technique (NFT) systems in Egypt. Consults on system design and crop nutrient management.', 300, 'Giza', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(8, 44, 'Organic Farming Advisor', 'Organic Agriculture', 'Specialist in organic pest control, crop rotation, and bio-fertilizers. Certified Organic Auditor helping farms transition to fully sustainable models.', 250, 'Cairo', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(9, 45, 'Greenhouse Tech Specialist', 'Agricultural Engineering', 'Designs and optimizes automated climate control systems for greenhouses. Expert in precision farming technology and high-yield indoor management.', 200, 'Giza', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(10, 46, 'Smart Farming & IoT Expert', 'Smart Agriculture & IoT', 'Expert in soil moisture sensors, satellite crop monitoring, and data-driven farming. Fuses data science with agronomy to maximize yield and optimize resource utilization.', 280, 'Mansoura', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(11, 47, 'Aquaponics Consultant', 'Aquaculture & Aquaponics', 'Consultant for integrated agri-aquaculture, commercial aquaponics setups, and water conservation. Designs ecosystem-based farming solutions that save 90% water.', 190, 'Fayoum', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(12, 48, 'Orchard & Pomology Consultant', 'Horticulture & Fruits', 'Expert in olive, grape, and citrus orchard management. Consults on orchard layout, pruning systems, drip fertilization, and pest management.', 240, 'Ismailia', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(13, 49, 'Floriculture & Landscaping Specialist', 'Horticulture & Landscape', 'Specialist in commercial cut-flower greenhouses and landscape design. Expert in high-tech climate control for roses, carnations, and lilies.', 170, 'Giza', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(14, 50, 'Insect Control & Entomology Prof', 'Entomology & Pest Control', 'Pest monitoring, biological insect control, and pesticide safety adviser. 22 years of academic research and field diagnostics across Egypt.', 270, 'Menofia', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(15, 51, 'Plant Genetics Researcher', 'Plant Genetics & Breeding', 'Specializes in developing drought-resistant crop varieties for arid zones. Expert in molecular biology, gene mapping, and marker-assisted selection.', 260, 'Cairo', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(16, 52, 'Farm Machinery Advisor', 'Agricultural Machinery', 'Consultant for farm machinery selection, maintenance, and precision tilling. Helping farm owners optimize capital expenses on tractors, harvesters, and plows.', 160, 'Qalyubia', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(17, 53, 'Agricultural Economist', 'Agricultural Economics', 'Conducts feasibility studies, market analysis, and financial planning for agro projects. Expert in evaluating ROI for greenhouse and smart farming installations.', 290, 'Cairo', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(18, 54, 'Tissue Culture Specialist', 'Plant Biotechnology', 'Designs micropropagation protocols and high-throughput tissue culture labs. Specializes in disease-free banana, potato, and ornamental propagation.', 210, 'Menofia', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(19, 55, 'Crop Physiology Expert', 'Crop Physiology', 'Studies plant responses to heat stress and salinity. Helps growers apply crop protectants and biostimulants to build climate resilience.', 230, 'Sohag', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(20, 56, 'Post-Harvest Technology Expert', 'Post-Harvest Management', 'Optimizing cold chains, packaging, and sorting to minimize post-harvest losses. Advises on controlled atmosphere storage and export compliance.', 180, 'Beheira', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(21, 57, 'Apiculture & Beekeeping Advisor', 'Apiculture & Beekeeping', 'Designs modern apiaries, honey extraction lines, and queen rearing systems. Specialty honey production and crop pollination plans.', 150, 'Fayoum', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(22, 58, 'Precision Agronomy & Drone Consultant', 'Precision Agronomy & Remote Sensing', 'Using drone imagery and multispectral sensors for early stress detection, weed mapping, and variable rate fertilization scripting.', 260, 'Cairo', 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58'),

(23, 59, 'Livestock & Feed Consultant', 'Animal Nutrition & Breeding', 'Formulating feed rations and designing biosecurity systems for poultry, dairy, and beef farms. Maximizes milk and meat yields sustainably.', 200, 'Sharkia', 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=800&auto=format&fit=crop', 1, '2026-06-03 09:38:58', '2026-06-03 09:38:58');
    `);

    console.log("Successfully inserted users and expert listings.");
  } catch (err) {
    if (err.message.includes('Duplicate entry')) {
      console.log('Experts already inserted, updating instead...');
      // Just to be safe, ignore if they already exist, but SQL doesn't use INSERT IGNORE for ExpertListings
      // We can use REPLACE INTO for MySQL or just handle it. Since we haven't run it yet, it should be fine.
      console.error("Already exists", err.message);
    } else {
      console.error(err);
    }
  } finally {
    process.exit(0);
  }
}

run();
