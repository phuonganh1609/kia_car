// validators/appointmentValidator.js

export const validateAppointment = (data) => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

  if (!data.firstName || !data.firstName.toString().trim()) {
    throw new Error("Tên (firstName) không được để trống");
  }

  if (!data.lastName || !data.lastName.toString().trim()) {
    throw new Error("Họ (lastName) không được để trống");
  }

  if (!data.phone || !phoneRegex.test(data.phone.toString())) {
    throw new Error("Số điện thoại không hợp lệ");
  }

  if (!data.content || !data.content.toString().trim()) {
    throw new Error("Nội dung tư vấn không được để trống");
  }

  
};