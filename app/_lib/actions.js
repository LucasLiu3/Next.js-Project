"use server";
import { auth, signIn, signOut } from "@/app/_lib/auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formDate) {
  //这个formDate是自带的，当提交表单的时候，表单里面有name的值，就全部在这里面了
  console.log(formDate);

  const session = await auth();
  if (!session) throw new Error("Must be logged in");

  const nationalID = formDate.get("nationalID");

  const countryAndFlag = formDate.get("nationality");

  const country = countryAndFlag.split("%").at(0);
  const flag = countryAndFlag.split("%").at(1);

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("need correct format for national Id");

  const updateInfo = { nationalID, nationality: country, countryFlag: flag };
  const id = session.user.guestId;

  console.log(updateInfo, id);
  await updateGuest(id, updateInfo);

  //这个函数是在这个路由地址下的broswer cache都会被重新更新
  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("Must be logged in");

  //这里是为了验证这个消费者只能删除他自己的booking
  const guestAllBookings = await getBookings(session.user.guestId);

  const guestAllBookingIds = guestAllBookings.map((booking) => booking.id);

  if (!guestAllBookingIds.includes(bookingId))
    throw new Error("You can not delete this booking");

  await deleteBooking(bookingId);
  revalidatePath("/account/reservations");
}

export async function editReservation(formDate) {
  const session = await auth();
  if (!session) throw new Error("Must be logged in");

  const bookingId = Number(formDate.get("bookingId"));

  const guestAllBookings = await getBookings(session.user.guestId);

  const guestAllBookingIds = guestAllBookings.map((booking) => booking.id);

  if (!guestAllBookingIds.includes(bookingId))
    throw new Error("You can not update this booking");

  const numGuests = Number(formDate.get("numGuests"));
  const observations = formDate.get("observations");

  const updateInfo = { numGuests, observations };
  console.log(updateInfo);

  await updateBooking(bookingId, updateInfo);

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath(`/account/reservations`);

  redirect("/account/reservations");
}

export async function creatNewBooking(firstArgu, fromDate) {
  const session = await auth();
  if (!session) throw new Error("Must be logged in");

  const newBookingObj = {
    ...firstArgu,
    guestId: session.user.guestId,
    numGuests: Number(fromDate.get("numGuests")),
    observations: fromDate.get("observations"),
    extrasPrice: 0,
    totalPrice: firstArgu.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  console.log(newBookingObj);

  await createBooking(newBookingObj);

  revalidatePath(`/account/reservations`);
  revalidatePath(`/cabins/${firstArgu.cabinId}`);
  redirect("/thankyou");
}
