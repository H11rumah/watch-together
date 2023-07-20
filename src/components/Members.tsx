import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Member from "./Member";

const Members: React.FC = () => {
    let members = useSelector((state: RootState) => state.web.members);

    return (
        <div className="members block">
            <span className="bottom_divider">Members</span>
            {members.map((elem, id) => (
                <Member memberUsername={elem} key={id} />
            ))}
        </div>
    );
};

export default Members;
