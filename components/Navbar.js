"use client"
import {
    ClerkProvider,
    SignInButton,
    SignUp,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    useAuth
} from '@clerk/nextjs'; // استخدام useAuth

import React from 'react';
import Link from 'next/link'; // تأكد من استيراد Link

function Navbar() {
    const { userId } = useAuth(); // جلب userId باستخدام useAuth
    const isAuth = !!userId; // التحقق من وجود مستخدم مسجل الدخول

    return (
        <header>
            <a href='/'></a>
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
            </ul>
            <div>
                {!isAuth ? (
                    <>
                        <Link href="/sign-in">
                            <li>Login</li>
                        </Link>
                        <Link href="/sign-up">
                            <li>Sign Up</li>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/profile">
                            <li>Profile</li>
                        </Link>
                        <li>
                            <UserButton afterSignOutUrl="/" />
                        </li>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;
