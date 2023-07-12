import React from "react";

type InputProps = {
    type: string;
    inputState: string;
    setInputState: React.Dispatch<React.SetStateAction<string>>;
    isFieldsEmpty: boolean;
    setIsFieldsEmpty: React.Dispatch<React.SetStateAction<boolean>>;
    isNeedRandomGenerator: boolean;
    title: string;
    errorState: string;
    setErrorState: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
};

const Input: React.FC<InputProps> = ({
    type,
    inputState,
    setInputState,
    isFieldsEmpty,
    setIsFieldsEmpty,
    isNeedRandomGenerator,
    title,
    errorState,
    setErrorState,
    placeholder,
}) => {
    function generateRandomId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    return (
        <div className="login_inputs_container">
            <label htmlFor={title}>
                <span>{title} </span>
                <span className="error">{errorState}</span>
            </label>
            <div>
                <input
                    type={type}
                    id={title}
                    className={isFieldsEmpty && !inputState.trim() ? "empty" : ""}
                    maxLength={22}
                    placeholder={`Example: ${placeholder}`}
                    autoComplete="off"
                    value={inputState}
                    onChange={(event) => setInputState(event.target.value)}
                    onFocus={() => {
                        setIsFieldsEmpty(false);
                        setErrorState("");
                    }}
                />
                {isNeedRandomGenerator ? (
                    <button className="main_page_button" onClick={() => setInputState(generateRandomId())}>
                        Generate
                    </button>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};
export default Input;
