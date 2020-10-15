const advancedResults = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };

  // Fields to exclude from results
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields & delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  let queryString = JSON.stringify(reqQuery);
  // Create Mongoose operators ($gt, $lt, etc.)
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = model.find(JSON.parse(queryString));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields);
  }

  // Sort Fields
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ')
    query = query.sort(fields);
  } else {
    query = query.sort('-name');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) query = query.populate(populate);

  const results = await query;

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit }
  }

  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next()
}

module.exports = advancedResults;