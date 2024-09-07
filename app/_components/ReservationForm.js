"use client";

import { differenceInDays } from "date-fns";
import { useReservation } from "./ReservationContext";
import { creatNewBooking } from "../_lib/actions";
import Button from "./Button";

function ReservationForm({ cabin, user }) {
  const { range, resetRange } = useReservation();

  const { maxCapacity, regularPrice, discount, id: cabinId } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = { startDate, endDate, numNights, cabinPrice, cabinId };

  //常用的传输数据，创建input框，然后设置hidden
  //但是对于大量大数据，可以用blind
  //将需要传输的数据，给需要运行的函数bind,作为第二个参数,
  //然后得到一个新的函数，那么下form的action，就直接运行这个函数就行
  //同时在那个实际运行函数里面的第一个传递值，就会成为这里的第二个参数
  const newCreatingBookingwithBind = creatNewBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <img
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
        action={async (formData) => {
          await newCreatingBookingwithBind(formData);
          resetRange();
        }}
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <Button>Reserve now</Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
