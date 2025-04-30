import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from "../../utils/axiosInstance"
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import NoDataImage from "../../assets/oops.png"
import AddNoteImage from "../../assets/book.png"


function Home() {

    const [openAddEditModel, setOpenEditModel] = useState({
        isShow: false,
        type: "add",
        data: null
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: 'add'
    });

    const [isSearch, setIsSearch] = useState(false);

    const [userInfo, setUserInfo] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();


    // Handle Edit
    const handleEdit = (noteDetails) => {
        setOpenEditModel({ isShow: true, type: 'edit', data: noteDetails })
    }

    const handleCloseToast = () => {
        setShowToastMsg({ isShown: false, message: "" })
    }

    const showToastMessage = (message, type) => {
        setShowToastMsg({ isShown: true, message, type })
    }

    // get user info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user)
            }
        }
        catch (err) {
            if (err.status === 501) {
                localStorage.clear();
                navigate("/login")
            }
        }
    }



    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) {
                setNotes(response.data.notes)
            }
        }
        catch (err) {
            console.log("Unexpected error occured")
        }
    }

    // Delete Note 
    const deleteNode = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete("/delete-note/" + noteId);

            if (response.data && !response.data.error) {
                showToastMessage("Note Deleted Successfully", "delete");
                getAllNotes();
            }
        }
        catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                console.log("An unexpected error occured. Please try again")
            }
        }
    }

    // search note

    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get('/search-notes', { params: { query }, });

            if (response.data && response.data.notes) {
                setIsSearch(true);
                setNotes(response.data.notes);
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    // Handle Clear Search

    const handleClearSerch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    // Update pin

    const updatePin = async (note) => {
        const noteId = note._id;
        try {
            const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
                isPinned: note.isPinned
            });
            if (response.data && response.data.message) {
                showToastMessage("Note Pinned Successfully");
                getAllNotes();
            }
        }
        catch (error) {
            if (error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                console.log("An unexpected error occured. Please try again")
            }
        }
    }


    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () => { }
    }, [])

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSerch} />
            <div className="container mx-auto p-2">

                {
                    notes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {notes.map((note, index) => (
                                <NoteCard
                                    key={note._id}
                                    title={note.title}
                                    date={note.createdOn}
                                    content={note.content}
                                    tags={note.tags}
                                    isPinned={note.isPinned}
                                    onEdit={() => handleEdit(note)}
                                    onDelete={() => { deleteNode(note) }}
                                    onPinNote={() => { updatePin(note) }}
                                />
                            ))
                            }
                        </div>
                    ) :
                        (<EmptyCard
                            imgSrc={isSearch ? NoDataImage : AddNoteImage}
                            message={isSearch ? `Oops! No notes found matching to your search.` : `Start creating your first note! Click the 'Add' button to join down your thoughts, ideas, and reminders. Let's get started`} />)
                }
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
                    onClose={() => { setOpenEditModel({ isShow: false, type: "add", data: null }) }}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />

            </Modal>

            <Toast
                isShow={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    )
}

export default Home