const validatePostBody = (req, res, next) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) return res.status(400).json({ error: 'title, content, and userId are required' });

  next();
};

export default validatePostBody;
