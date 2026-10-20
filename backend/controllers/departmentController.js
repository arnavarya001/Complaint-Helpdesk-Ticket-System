const Department = require('../models/Department');
const Ticket = require('../models/Ticket');

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const ticketCount = await Ticket.countDocuments({ department: dept._id });
        return { ...dept.toObject(), ticketCount };
      })
    );
    res.json(departmentsWithCounts);
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    const existing = await Department.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existing) {
      return res.status(400).json({ message: 'A department with this name already exists' });
    }
    const department = await Department.create({
      name: name.trim(),
      description: description ? description.trim() : '',
    });
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    if (name && name.trim()) {
      const existing = await Department.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (existing) {
        return res.status(400).json({ message: 'A department with this name already exists' });
      }
      department.name = name.trim();
    }
    if (description !== undefined) {
      department.description = description.trim();
    }
    await department.save();
    res.json(department);
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await Ticket.updateMany({ department: department._id }, { $set: { department: null } });
    await department.deleteOne();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
