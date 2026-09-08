const cmsService = require('../services/cms.service');

const getAllCmsPages = async (req, res, next) => {
  try {
    const list = await cmsService.getAllCmsPages();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const getCmsPageByKey = async (req, res, next) => {
  try {
    const page = await cmsService.getCmsPageByKey(req.params.pageKey);
    return res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

const createOrUpdateCmsPage = async (req, res, next) => {
  try {
    const pageData = req.body;
    if (req.file) {
      pageData.image = `uploads/images/${req.file.filename}`;
    }
    const page = await cmsService.createOrUpdateCmsPage(req.params.pageKey, pageData);
    return res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCmsPages,
  getCmsPageByKey,
  createOrUpdateCmsPage
};
