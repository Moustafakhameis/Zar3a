import { Farm, Sector } from '../models/index.js';

export const getFarms = async (req, res) => {
  try {
    const whereClause = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    const farms = await Farm.findAll({
      where: whereClause,
      include: [Sector]
    });
    res.json(farms);
  } catch (error) {
    console.error('Error fetching farms:', error);
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
};

export const createFarm = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Farm name is required' });

    const newFarm = await Farm.create({
      name,
      userId: req.user.id
    });
    
    res.status(201).json(newFarm);
  } catch (error) {
    console.error('Error creating farm:', error);
    res.status(500).json({ error: 'Failed to create farm' });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    const farm = await Farm.findOne({ where: { id: farmId, userId: req.user.id } });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    await farm.destroy();
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    res.status(500).json({ error: 'Failed to delete farm' });
  }
};

export const createSector = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { name, sensorId, location, crop, isAuto, moisture } = req.body;

    const farm = await Farm.findOne({ where: { id: farmId, userId: req.user.id } });
    if (!farm) return res.status(404).json({ error: 'Farm not found' });

    const newSector = await Sector.create({
      farmId: farm.id,
      name,
      sensorId,
      location,
      crop,
      isAuto: isAuto !== undefined ? isAuto : true,
      moisture: moisture !== undefined ? moisture : 50
    });

    res.status(201).json(newSector);
  } catch (error) {
    console.error('Error creating sector:', error);
    res.status(500).json({ error: 'Failed to create sector' });
  }
};

export const deleteSector = async (req, res) => {
  try {
    const { sectorId } = req.params;
    const sector = await Sector.findByPk(sectorId, { include: [Farm] });
    
    if (!sector || sector.Farm.userId !== req.user.id) {
      return res.status(404).json({ error: 'Sector not found' });
    }

    await sector.destroy();
    res.json({ message: 'Sector deleted successfully' });
  } catch (error) {
    console.error('Error deleting sector:', error);
    res.status(500).json({ error: 'Failed to delete sector' });
  }
};
