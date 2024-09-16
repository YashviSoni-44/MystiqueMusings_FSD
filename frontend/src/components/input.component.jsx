import React, { useState, useContext } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ThemeModeContext } from '../components/navbar.component';

const InputBox = ({ name, type, id, value, placeholder, icon: IconComponent, disable=false }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const themeMode = useContext(ThemeModeContext);

    return (
        <div className="relative w-[100%] mb-4">
            <input
                name={name}
                type={type === "password" ? (passwordVisible ? "text" : "password") : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                disabled={disable}
                className="input-box"
                style={{
                    backgroundColor: themeMode === 'dark' ? '#1D1D1D' : '#E3DFFD',
                    color: themeMode === 'dark' ? '#E3E3E3' : '#1D1D1D', // Text color
                    borderColor: themeMode === 'dark' ? '#3A3A3A' : '#CFCFCF', // Border color
                    caretColor: themeMode === 'dark' ? '#E3E3E3' : '#1D1D1D', // Caret color
                }}
            />
            <div className="input-icon" style={{ color: themeMode === 'dark' ? '#E3E3E3' : '#1D1D1D' }}>
                <IconComponent />
            </div>
            {type === "password" && (
                <div className="input-icon cursor-pointer" style={{ right: '8px', left: 'auto', color: themeMode === 'dark' ? '#E3E3E3' : '#1D1D1D' }}>
                    {passwordVisible ? 
                        <VisibilityOffIcon onClick={() => setPasswordVisible(false)} /> : 
                        <VisibilityIcon onClick={() => setPasswordVisible(true)} />
                    }
                </div>
            )}
            <style>{`
                .input-box::placeholder {
                    color: ${themeMode === 'dark' ? '#E3E3E3' : 'black'}; // Placeholder color for visibility
                }
            `}</style>
        </div>
    );
}

export default InputBox;
