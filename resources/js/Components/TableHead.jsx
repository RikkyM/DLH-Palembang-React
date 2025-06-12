import { ArrowDown, ArrowUp } from "lucide-react";

const TableHead = ({ columns, sort, direction, onSort, textAlign }) => {
    const handleSort = (column) => {
        const newDirection =
            sort === column && direction === "asc" ? "desc" : "asc";
        onSort(column, newDirection);
    };

    return (
        <tr className="*:font-medium *:text-sm *:p-2 *:uppercase">
            {columns.map((col) => (
                <th
                    key={col.key}
                    className={`${col.align} select-none cursor-pointer`}
                    onClick={() => handleSort(col.key)}
                >
                    <span className="flex items-center gap-1.5">
                        {col.label}
                        {sort === col.key && (
                            <span className="ml-1">
                                {direction === "asc" ? (
                                    <ArrowUp size={20} />
                                ) : (
                                    <ArrowDown size={20} />
                                )}
                            </span>
                        )}
                    </span>
                </th>
            ))}
            <th className="text-right">Aksi</th>
        </tr>
    );
};

export default TableHead;
