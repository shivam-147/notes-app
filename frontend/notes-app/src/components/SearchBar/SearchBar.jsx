import React from 'react'
import { IoMdClose } from "react-icons/io"
import { FaMagnifyingGlass } from "react-icons/fa6"

function SearchBar() {
    return (
        <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
            <input
                type="text"
                placeholder="Search Note"
                className="w-full text-xs bg-transparent py-[11px] outline-none"
            />

            <IoMdClose className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" />

            <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" />

        </div>
    )
}

export default SearchBar