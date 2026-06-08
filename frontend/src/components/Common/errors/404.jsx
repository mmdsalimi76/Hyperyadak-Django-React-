import React from "react";
import ErrorPageTemplate from "./ErrorPageTemplate";

const NotFound = () => (
  <ErrorPageTemplate
    code="404"
    title="صفحه یافت نشد"
    message="صفحه‌ای که دنبال آن هستید وجود ندارد. لطفاً آدرس را بررسی کنید و دوباره تلاش کنید."
  />
);

export default NotFound;
