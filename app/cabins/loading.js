import Spinner from "../_components/Spinner";

export default function LoadingCabin() {
  return (
    <div className="grid items-center justify-center">
      <Spinner></Spinner>
      <p className="text-xl text-primary-200">Loading Cabin Data...</p>
    </div>
  );
}
