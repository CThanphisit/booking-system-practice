"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerUser(data: {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}) {
  const rawFormData = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    email: data.email,
    password: data.password,
  };

  console.log("rawFormData", rawFormData);

  const res = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  });

  if (!res.ok) {
    // แทนที่จะ throw error ให้ return object กลับไปแสดงที่ UI
    return { message: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" };
  }

  // ล้าง Cache หน้าเดิม (ถ้าจำเป็น)
  // revalidatePath("/register");

  // เปลี่ยนหน้าไปที่ Login
  redirect("/login");
}

// export async function loginUser(prevState: any, formData: FormData) {
//   const rawFormData = {
//     email: formData.get("email"),
//     password: formData.get("password"),
//   };

//   const res = await fetch("http://localhost:3001/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(rawFormData),
//   });

//   console.log("resLogin", res);

//   const data = await res.json();

//   if (!res.ok) {
//     // แทนที่จะ throw error ให้ return object กลับไปแสดงที่ UI
//     return {
//       success: false,
//       message: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่",
//     };
//   }

//   return {
//     success: true,
//     accessToken: data.access_token, // สมมติว่า API คืนค่าชื่อนี้
//     message: "เข้าสู่ระบบสำเร็จ",
//   };
// }
