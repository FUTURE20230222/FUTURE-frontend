/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import MovementController from '../MovementController/MovementController';
import './PopUpController.scss'

const PopUpController = ({ actionSocket, rid, isButtonType = false }) => {
    const containerRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`pop-up ${isOpen ? 'shown' : 'hidden'}`}
            ref={containerRef}
        >
            <div>
                <div style={{ textAlign: 'center' }}>
                    Robot Movement Control
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MovementController
                        actionSocket={actionSocket} rid={rid} isButtonType={isButtonType}
                    />
                </div>
            </div>
            <a
                href="#section"
                className="theme-button"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
            >
                <i className="iconsminds-cursor-move-2" />
            </a>
        </div>
    );
};

export default PopUpController;
