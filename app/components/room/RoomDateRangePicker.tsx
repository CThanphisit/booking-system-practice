"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  bookedDates?: Date[];
};

export function RoomDateRangePicker({
  value,
  onChange,
  bookedDates = [],
}: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  console.log("date", date);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange?.(range);
  };

  // console.log("bookedDatesCa", bookedDates);
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger>
          <div
            // variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border rounded-md px-3 py-2 cursor-pointer",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>เลือกช่วงวันที่</span>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(d) =>
              d < new Date() ||
              bookedDates.some(
                (booked) => booked.toDateString() === d.toDateString(),
              )
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
