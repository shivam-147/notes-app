import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"


function Home() {

    const [openAddEditModel, setOpenEditModel] = useState({
        isShow: true,
        type: "add",
        data: null
    })

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-2">
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <NoteCard
                        title="Meating"
                        date="23rd"
                        content="This is a note about meeting"
                        tags="shivam"
                        isPinned={true}
                        onEdit={() => { }}
                        onDelete={() => { }}
                        onPinNote={() => { }}
                    />
                </div>
            </div>

            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg:blue-600 absolute right-10 bottom-10">
                <MdAdd className="text-[32px] text-white" onClick={() => { setOpenEditModel({ isShow: true, type: "add", data: null }) }} />
            </button>



            <Modal
                isOpen={openAddEditModel.isShow}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rbga(0,0,0,0.2)"
                    }
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white border-2 rounded-md mx-auto mt-14 p-5 overflow-hidden"
            >
                <AddEditNotes
                    type={openAddEditModel.type}
                    noteData={openAddEditModel.data}
                    onClose={() => { setOpenEditModel({ isShow: false, type: "add", data: null }) }} />
            </Modal>
        </>
    )
}

export default Home