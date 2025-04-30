import React from 'react'
import { MdCreate, MdDelete, MdOutlinePushPin } from 'react-icons/md'
import moment from "moment"

function NoteCard(
    {
        title,
        date,
        content,
        tags,
        isPinned,
        onEdit,
        onDelete,
        onPinNote
    }
) {
    return (
        <div className="border rounded p-4 bg-white shadow-md
         hover:shadow-2xl transition-all ease-in-out ">
            <div className="flex item-center justify-between">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{moment(date).format('Do MMM YYYY')}</span>
                </div>

                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'} cursor-pointer`} onClick={onPinNote} />
            </div>
            <p className="text-xs text-slate-500">{content?.slice(0, 60)}</p>

            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">
                    {
                        tags.map((tag) => (`#${tag} `))
                    }
                </div>
                <div className="flex items-center gap-2">
                    <MdCreate
                        className="icon-btn hover:text-green-600 cursor-pointer" onClick={onEdit} />
                    <MdDelete
                        className="icon-btn hover:text-red-500 cursor-pointer"
                        onClick={onDelete} />
                </div>
            </div>
        </div>
    )
}

export default NoteCard