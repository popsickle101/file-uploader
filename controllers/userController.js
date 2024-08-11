const bcryptjs = require('bcryptjs');
const prisma = require('../prisma/prisma');

exports.signUp = async (req, res, next) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
