export function checkToken(req, res, next) {
  // const token = req.header("Token");
  // const VALID_TOKEN = "тут_треба_вставити_справжній_токен";

  // if (!token || token !== VALID_TOKEN) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "The token expired or is invalid.",
  //   });
  // }
  next();
}
