import {SortableContext, rectSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import {FaTrash} from "react-icons/fa";
import {useEffect} from "react";

const Trash = ({items, overTrash}) => {
    const {setNodeRef} = useDroppable({id: "trash"});

    return (
        <SortableContext items={items} strategy={rectSortingStrategy}>
            <div ref={setNodeRef}
                 style={{minWidth: "100px", minHeight: "100px", maxWidth: "100px", maxHeight: "100px"}}
                 className={`d-flex justify-content-center align-items-center border 
                 border-dark rounded ${overTrash ? "bg-danger trash-shadow" : "bg-danger-subtle"}`}
            >
                <FaTrash className="w-75 h-75"/>
            </div>
        </SortableContext>
    );
}

export default Trash;