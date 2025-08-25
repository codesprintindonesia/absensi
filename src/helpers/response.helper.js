export function sendResponse(
  res,
  { code = 200, message = "OK", data = null, metadata = null } = {}
) {
  return res.status(code).json({ code, message, data, metadata });
}
