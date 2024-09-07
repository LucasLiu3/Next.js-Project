"use client";

import { TrashIcon } from "@heroicons/react/24/solid";

import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId, onDelete }) {
  //这个hook和profile页面里那个useFormStatus 钩子一样
  //当提交表单或者按钮对数据更新的时候，会来反映处理状态过度的钩子
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Are you sure to delete your reservation?"))
      startTransition(() => onDelete(bookingId));
  }

  return (
    <button
      //这里是按钮，所以要使用server action，必须在use client的component里面才能使用
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      {isPending ? (
        <span className="mt-auto">
          <SpinnerMini />
        </span>
      ) : (
        <>
          <span className="mt-1">Delete</span>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
        </>
      )}
    </button>
  );
}

export default DeleteReservation;
