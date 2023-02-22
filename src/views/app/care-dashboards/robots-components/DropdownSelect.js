import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const DropdownSelect = (setRobot) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret color="primary">
                Select Robot
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem >AOBO-1001</DropdownItem>
                <DropdownItem divider />
                <DropdownItem >SAUWU-1001</DropdownItem>
                <DropdownItem divider />
                <DropdownItem >SAUWU-1002</DropdownItem>
                <DropdownItem divider />
                <DropdownItem >SAUWU-1003</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}

export default DropdownSelect;
