const eventService = require('../services/event.service');

const getAllEvents = async (req, res, next) => {
  try {
    const list = await eventService.getAllEvents();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    return res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;
    if (req.file) {
      eventData.image = `uploads/images/${req.file.filename}`;
    }
    const event = await eventService.createEvent(eventData);
    return res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = `uploads/images/${req.file.filename}`;
    }
    const event = await eventService.updateEvent(req.params.id, updateData);
    return res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
