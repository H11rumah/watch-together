import React from "react";

type MemberProps = {
    username: string;
};

const Member: React.FC<MemberProps> = ({ username }) => {
    return (
        <div className="member">
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17,9c0-1.381-0.56-2.631-1.464-3.535C14.631,4.56,13.381,4,12,4S9.369,4.56,8.464,5.465C7.56,6.369,7,7.619,7,9  s0.56,2.631,1.464,3.535C9.369,13.44,10.619,14,12,14s2.631-0.56,3.536-1.465C16.44,11.631,17,10.381,17,9z" />
                <path d="M6,19c0,1,2.25,2,6,2c3.518,0,6-1,6-2c0-2-2.354-4-6-4C8.25,15,6,17,6,19z" />
            </svg>
            <span>{username}</span>
        </div>
    );
};

export default Member;
