import React from "react";
import ErrorPageTemplate from "./ErrorPageTemplate";

const Unauthorized = () => (
  <ErrorPageTemplate
    code="401"
    title="نیاز به ورود"
    message="شما به این صفحه دسترسی ندارید. لطفاً وارد حساب کاربری خود شوید تا ادامه دهید."
  />
);

export default Unauthorized;
