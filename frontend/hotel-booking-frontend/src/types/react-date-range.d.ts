declare module "react-date-range" {
  import { CSSProperties } from "react";

  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface RangeKeyDict {
    [key: string]: {
      startDate: Date;
      endDate: Date;
      key: string;
    };
  }

  export interface DateRangeProps {
    ranges: Range[];
    editableDateInputs?: boolean;
    moveRangeOnFirstSelection?: boolean;
    onChange: (ranges: RangeKeyDict) => void;
    minDate?: Date;
    maxDate?: Date;
    direction?: "horizontal" | "vertical";
    showDateDisplay?: boolean;
    className?: string;
  }

  export interface DateRangePickerProps extends DateRangeProps {
    months?: number;                     // ✅ allow multiple months
    showMonthAndYearPickers?: boolean;
    showPreview?: boolean;
  }

  export const DateRange: React.FC<DateRangeProps>;
  export const DateRangePicker: React.FC<DateRangePickerProps>; // ✅ add this
}