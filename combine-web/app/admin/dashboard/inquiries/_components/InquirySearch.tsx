"use client";

import {
  Search,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";


// ============================================================
// COMPONENT
// ============================================================

export default function InquirySearch() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();


  const [
    value,
    setValue,
  ] = useState(
    searchParams.get("search") ?? ""
  );


  // ==========================================================
  // SYNC URL
  // ==========================================================

  useEffect(() => {

    setValue(
      searchParams.get("search") ?? ""
    );

  }, [
    searchParams,
  ]);


  // ==========================================================
  // SEARCH
  // ==========================================================

  function handleSearch(
    searchValue: string
  ) {

    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    const trimmed =
      searchValue.trim();


    if (trimmed) {

      params.set(
        "search",
        trimmed
      );

    } else {

      params.delete(
        "search"
      );

    }


    // Reset pagination
    // when search changes.

    params.delete(
      "page"
    );


    const query =
      params.toString();


    router.push(
      query
        ? `/admin/dashboard/inquiries?${query}`
        : "/admin/dashboard/inquiries"
    );

  }


  // ==========================================================
  // ENTER
  // ==========================================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      handleSearch(
        value
      );

    }

  }


  return (

    <div
      className="
        relative
        w-full
        max-w-md
      "
    >

      <Search
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          h-[18px]
          w-[18px]
          -translate-y-1/2
          text-neutral-400
        "
      />


      <input
        value={
          value
        }
        onChange={(
          event
        ) =>
          setValue(
            event.target.value
          )
        }
        onKeyDown={
          handleKeyDown
        }
        placeholder="
          Search name, email or WhatsApp...
        "
        className="
          h-11
          w-full
          rounded-xl
          border
          border-neutral-200
          bg-white
          py-2
          pl-10
          pr-4
          text-sm
          text-neutral-900
          outline-none
          transition
          placeholder:text-neutral-400
          focus:border-neutral-400
          focus:ring-2
          focus:ring-black/5
        "
      />

    </div>

  );

}