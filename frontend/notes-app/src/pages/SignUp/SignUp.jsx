import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';

function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please Enter your name");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please Enter valid email address");
            return;
        }
        if (!password) {
            setError("Please Enter your password");
            return;
        }
        setError("");
        // Sing Up API call
    }

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-7 ">Sign Up</h4>

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-box"
                        />

                        <input
                            type="text" placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-box" />
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        {error && <p className="text-red-500 text-sx pb-1">{error}</p>}

                        <button type="submit" className="btn-primary">Create Account</button>

                        <p className="text-sm text-center mt-4"> Already have an account? {" "}
                            <Link to="/login" className="font-medium text-primary underline">
                                Login</Link>
                        </p>
                    </form>
                </div>
            </div>

        </>
    )
}

export default SignUp