import { ChevronDown } from "lucide-react";
import React from "react";

const PageLimit = ({ state, setState }) => {
  return (
    <label
      htmlFor="showData"
      className="relative flex w-full min-w-20 max-w-24 cursor-pointer items-center gap-1.5 text-sm"
    >
      <select
        name="showData"
        id="showData"
        value={state}
        onChange={(e) => {
          setState(parseInt(e.target.value));
        }}
        className="w-full cursor-pointer appearance-none rounded border bg-transparent px-2 py-1.5 shadow outline-none"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="250">250</option>
        <option value="-1">Semua</option>
      </select>
      <ChevronDown
        size={20}
        className="pointer-events-none absolute right-1 bg-transparent"
      />
    </label>
  );
};

export default React.memo(PageLimit);
