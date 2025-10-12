import DialogForm from "@/Components/Dialog";
import { X } from "lucide-react";

const Dialog = ({ isOpen, onClose, item = [], role }) => {

    const roleConfig = {
        ROLE_PENDAFTAR: 'pendaftar',
        ROLE_KUPTD: "kuptd",
        ROLE_KATIM: 'katim',
        ROLE_KABID: 'kabid'
    }

  return (
    <DialogForm isOpen={isOpen} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="text-lg font-medium">History SPKRD</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="bg-red-500 p-5">
        {console.log(item)}
          {item &&
            item.map((data, i) => <div key={i}>{roleConfig[data.role]}</div>)}
          {/* {item && item.length === 0 ? (
            <div>Belum ada riwayat.</div>
          ) : (
            item.map((data, i) => <div key={i}></div>)
          )} */}
        </div>
      </div>
    </DialogForm>
  );
};

export default Dialog;
