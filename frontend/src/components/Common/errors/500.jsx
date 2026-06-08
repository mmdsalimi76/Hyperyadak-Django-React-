import React from "react";
import ErrorPageTemplate from "./ErrorPageTemplate";

const ServerError = () => (
  <ErrorPageTemplate
    code="500"
    title="خطای سرور داخلی"
    message="مشکلی در سرور رخ داده است. لطفاً بعداً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید."
  />
);

export default ServerError;
