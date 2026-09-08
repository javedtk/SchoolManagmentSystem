const { CmsPage } = require('../models');

const getAllCmsPages = async () => {
  return CmsPage.findAll();
};

const getCmsPageByKey = async (pageKey) => {
  const page = await CmsPage.findOne({ where: { page_key: pageKey } });
  if (!page) {
    throw { status: 404, message: `CMS page '${pageKey}' not found.` };
  }
  return page;
};

const createOrUpdateCmsPage = async (pageKey, pageData) => {
  const [page, created] = await CmsPage.findOrCreate({
    where: { page_key: pageKey },
    defaults: {
      page_key: pageKey,
      title: pageData.title,
      content: pageData.content,
      image: pageData.image
    }
  });

  if (!created) {
    await page.update({
      title: pageData.title,
      content: pageData.content,
      image: pageData.image || page.image
    });
  }

  return page;
};

module.exports = {
  getAllCmsPages,
  getCmsPageByKey,
  createOrUpdateCmsPage
};
