// src/utils/dashboardUtils.js
export const formatPrice = (price) => {
  if (!price) return '۰';
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

export const getStatusText = (status) => {
  const map = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
    cancelled: 'لغو شده',
  };
  return map[status] || status;
};

export const getStatusBadge = (status) => {
  const colours = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colours[status] || 'bg-gray-100 text-gray-700';
};

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('fa-IR');
};

export const getTicketStatusText = (status) => {
  const map = {
    open: 'باز',
    pending: 'در انتظار پاسخ',
    answered: 'پاسخ داده شده',
    closed: 'بسته شده',
  };
  return map[status] || status;
};

export const getTicketStatusBadge = (status) => {
  const colours = {
    open: 'bg-blue-100 text-blue-700 border border-blue-200',
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    answered: 'bg-green-100 text-green-700 border border-green-200',
    closed: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return colours[status] || 'bg-gray-100 text-gray-700';
};