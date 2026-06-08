import React from "react";
import ErrorPageTemplate from "./ErrorPageTemplate";

const BadRequest = () => (
  <ErrorPageTemplate
    code="400"
    title="درخواست نامعتبر"
    message="درخواست شما به درستی ارسال نشده است. لطفاً داده‌های وارد شده را بررسی کنید و دوباره تلاش کنید."
  />
);

export default BadRequest;
