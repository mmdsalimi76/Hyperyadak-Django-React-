import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout/Layout"; // Import Layout
import Checkout from "./Checkout";
import PaymentCallback from "./PaymentCallback";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import PaymentsList from "./PaymentsList";

const PaymentsRoutes = () => (
  <Routes>
    <Route path="checkout" element={<Checkout />} />
    <Route path="callback" element={<PaymentCallback />} />
    <Route
      path="success"
      element={
        <Layout>
          <PaymentSuccess />
        </Layout>
      }
    />
    <Route path="failure" element={<PaymentFailure />} />
    <Route path="history" element={<PaymentsList />} />
  </Routes>
);

export default PaymentsRoutes;
