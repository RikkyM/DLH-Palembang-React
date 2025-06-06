import Dialog from "@/Components/Dialog";

const DialogDelete = ({ isOpen, onClose }) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onClick={(e) => e.stopPropagation()}>
                Delete Modal
            </form>
        </Dialog>
    );
};

export default DialogDelete;
