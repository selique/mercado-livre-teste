const API = require("../services/api");
const path = require("path");
/**
 * Dummy controller
 * @method apiCtrl
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.apiCtrl = (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
};

/**
 * Search Product
 * @method apiSearchCtrl
 * @param  {[type]}      req [description]
 * @param  {[type]}      res [description]
 * @return {[type]}          [description]
 */
module.exports.apiSearchCtrl = (req, res) => {
  let term = req.params.term;
  if (!term) term = req.query.q;
  if (!term) {
    res.status(422);
    res.send({ error: "term to search is required" });
  }
  API.doSearchItems(term)
    .then(result => {
      const parsedResults = API.parseResultSearch(result);
      res.send(parsedResults);
    })
    .catch(error => {
      res.send(error);
    });
};

/**
 * Product detail
 * @method apiProductCtrl
 * @param  {[type]}       req [description]
 * @param  {[type]}       res [description]
 * @return {[type]}           [description]
 */
module.exports.apiProductCtrl = (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(422);
    res.send({ error: "Product Id is required" });
  }
  API.doGetProductDetail(productId)
    .then(resultDetail => {
      const parseDetail = API.parseProductDetail(resultDetail);

      API.doGetProductDescription(productId)
        .then(resultDescription => {
          parseDetail.item.description = API.parseProductDescription(
            resultDescription
          );
          //res.send(parseDetail);
          API.doGetCategory(parseDetail.item.category_id)
            .then(resultCategories => {
              const parseCategories = API.parseBreadcrum(resultCategories);
              parseDetail.item.categories = parseCategories;
              res.send(parseDetail);
            })
            .catch(error => {
              res.send(error);
            });
        })
        .catch(error => {
          res.send(error);
        });
    })
    .catch(error => {
      res.send(error);
    });
};

module.exports.apiCategoryCtrl = (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    res.status(422);
    res.send({ error: "Category Id is required" });
  }
  API.doGetCategory(categoryId)
    .then(resultDetail => {
      const parseDetail = API.parseBreadcrum(resultDetail);
      res.send(parseDetail);
    })
    .catch(error => {
      res.send(error);
    });
};
