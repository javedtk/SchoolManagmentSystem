const { Event } = require('../models');

const getAllEvents = async () => {
  return Event.findAll({ order: [['event_date', 'DESC']] });
};

const getEventById = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw { status: 404, message: 'Event not found.' };
  }
  return event;
};

const createEvent = async (eventData) => {
  return Event.create(eventData);
};

const updateEvent = async (id, updateData) => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw { status: 404, message: 'Event not found.' };
  }
  return event.update(updateData);
};

const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw { status: 404, message: 'Event not found.' };
  }
  await event.destroy();
  return { message: 'Event deleted successfully.' };
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
