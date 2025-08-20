import { ArrowDown, ArrowUp } from "lucide-react";

const TableHead = ({
  columns,
  sort,
  direction,
  onSort,
  children = null,
  user = null,
  textAlign = "text-left",
}) => {
  const handleSort = (column) => {
    const newDirection =
      sort === column && direction === "desc" ? "asc" : "desc";
    onSort(column, newDirection);
  };

  return (
    <tr className="*:p-2 *:text-sm *:font-medium *:uppercase">
      {columns.map((col) => (
        <th
          key={col.key}
          className={`${col.align} cursor-pointer select-none`}
          onClick={() => handleSort(col.key)}
        >
          <span className="flex items-center gap-1.5">
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
      <th className="text-right sticky top-0 right-0 bg-white shadow-xl">Aksi</th>
    </tr>
  );
};

export default TableHead;
