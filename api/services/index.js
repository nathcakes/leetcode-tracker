const db = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const { sequelize } = require('../models');

const getTypes = async () => {
  const sp_types = await db.level_offset.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('type')), 'type']]
  })
  return sp_types.map(x=>x.type);
}

const getLevels = async () => {
  const sp_types = await db.level_offset.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('level')), 'level']]
  })
  return sp_types.map(x=>x.level);
}

const getCategories = async () => {
  const sp_categories = await db.category.findAll({
    attributes: ['name']
  })
  return sp_categories.map(x=>x.name);
}

const getOffset = async (type, level) => {
  const data = await db.level_offset.findOne({
    where: {
      type,
      level
    }
  });

  return data.offset;
}

const insertSubmission = async (payload) => {
  await db.submission.bulkCreate(payload);
  const resp = [
    {
      name: payload[0].category,
      start: moment().format('YYYY-MM-DD HH:mm'),
      end: moment().add(5,'minute').format('YYYY-MM-DD HH:mm'),
      color: 'green',
      timed: 1,
      link: payload[0].link,
      type: payload[0].type,
      level: payload[0].level,
      category: payload[0].category,
      rts: payload[0].rts
    },
    {
      name: payload[1].category,
      start: payload[1].dtCreated.format('YYYY-MM-DD HH:mm'),
      end: payload[1].dtCreated.add(5,'minute').format('YYYY-MM-DD HH:mm'),
      color: 'red',
      timed: 1,
      link: payload[1].link,
      type: payload[1].type,
      level: payload[1].level,
      category: payload[1].category,
      rts: payload[1].rts
    },
  ];

  return resp;
}

const getAllSubmissions = async (from, to) => {
  const fromDate = moment(from).startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const toDate = moment(to).endOf('day').format('YYYY-MM-DD HH:mm:ss');

  let submittedList = await db.submission.findAll({
    where: {
      dtCreated: { [Op.between]: [ fromDate, toDate] }
    }
  });

  submittedList = submittedList.map((submission) => ({
    id: submission.id,
    name: submission.category,
    start: moment(submission.dtCreated).format('YYYY-MM-DD HH:mm'),
    end: moment(submission.dtCreated).add(5,'minute').format('YYYY-MM-DD HH:mm'),
    color: submission.done == 1 ? 'green' : 'red',
    timed: 1,
    link: submission.link,
    type: submission.type,
    level: submission.level,
    category: submission.category,
    rts: submission.rts,
    done: submission.done,
  }));

  return submittedList;
}

const getCurrentDaySubmits = async (category, type, level) => {
  const count = await db.submission.count({
    where: {
      dtCreated: { [Op.between]: [ moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')] },
      category,
      level,
      type
    }
  });

  return count;
}


module.exports = {
  getTypes,
  getCategories,
  getLevels,
  getOffset,
  insertSubmission,
  getAllSubmissions,
  getCurrentDaySubmits
}