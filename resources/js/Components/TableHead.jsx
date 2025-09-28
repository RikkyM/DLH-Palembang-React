import { ArrowDown, ArrowUp } from "lucide-react";

const TableHead = ({
  columns,
  sort,
  direction,
  onSort,
  children = null,
  user = null,
}) => {
  const handleSort = (column) => {
    const newDirection =
      sort === column && direction === "desc" ? "asc" : "desc";
    onSort(column, newDirection);
  };

  return (
    <tr className="text-white *:p-2 *:text-xs *:md:text-sm *:font-medium *:uppercase">
      {columns.map((col) => (
        <th
          key={col.key}
          className={`${col.align} sticky top-0 z-0 cursor-pointer select-none bg-[#F1B174]`}
          onClick={() => handleSort(col.key)}
          title="Sort"
        >
          <span className="inline-flex items-center gap-1.5">
            {col.label}
            {sort === col.key && (
              <span className="ml-1">
                {direction === "desc" ? (
                  <ArrowUp size={20} />
                ) : (
                  <ArrowDown size={20} />
                )}
              </span>
            )}
          </span>
        </th>
      ))}
      {children}
      <th className="sticky right-0 top-0 z-10 bg-[#F1B174] text-right text-white">
        Aksi
      </th>
    </tr>
  );
};

export default TableHead;
