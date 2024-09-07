import { auth } from "../_lib/auth";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";

import ReservationForm from "./ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";

async function Reservation({ cabin }) {
  const [bookedDates, settings] = await Promise.all([
    await getBookedDatesByCabinId(cabin.id),
    await getSettings(),
  ]);

  const session = await auth();

  return (
    <div className="grid grid-cols-2  border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      ></DateSelector>
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user}></ReservationForm>
      ) : (
        <LoginMessage></LoginMessage>
      )}
    </div>
  );
}

export default Reservation;
