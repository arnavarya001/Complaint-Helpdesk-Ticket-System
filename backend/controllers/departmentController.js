const Department = require('../models/Department');
const Ticket = require('../models/Ticket');

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    const list = await Promise.all(
      departments.map(async (dept) => {
        const ticketCount = await Ticket.countDocuments({ department: dept._id });
        return { ...dept.toObject(), ticketCount };
      })
    );
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const department = await Department.create({ name, description: description || '' });
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(department);
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    await Ticket.updateMany({ department: req.params.id }, { $set: { department: null } });
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
