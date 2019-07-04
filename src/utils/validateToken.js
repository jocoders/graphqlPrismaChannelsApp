import * as jwt from "jsonwebtoken";

const validateToken = token => {
  return jwt.verify(token, "thisisasecret", function(err, decodeded) {
    if (err) {
      console.log("Token error");
    } else {
      console.log("Token has approved");
    }
  });
};

export { validateToken as default };
