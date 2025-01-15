import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from 'react-icons/lu'

function PasswordInput({ value, onChange, placeholder }) {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    return (
        <div className="flex items-center  border-[1.5px] px-5 rounded mb-3">
            <input
                value={value}
                type={isShowPassword ? "text" : "password"}
                onChange={onChange}
                placeholder={placeholder || "Password"}
                className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none" />
            {isShowPassword ? <LuEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
            /> : <LuEyeClosed
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
            />}

        </div>
    )
}

export default PasswordInput