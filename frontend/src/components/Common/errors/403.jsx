import React from "react";
import ErrorPageTemplate from "./ErrorPageTemplate";

const Forbidden = () => (
  <ErrorPageTemplate
    code="403"
    title="دسترسی غیرمجاز"
    message="شما اجازه مشاهده این صفحه را ندارید. اگر فکر می‌کنید این یک اشتباه است، با پشتیبانی تماس بگیرید."
  />
);

export default Forbidden;
