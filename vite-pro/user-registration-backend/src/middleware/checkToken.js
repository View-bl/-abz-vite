export function checkToken(req, res, next) {
  const token = req.header("Token");
 if (token !== "your-valid-token") {
   return res.status(401).json({
     success: false,
     message: "The token expired.",
   });
 }
  next();
}
