import React, { useState } from "react";
import LeftPanel from "../LeftPanel";
import ExpensesList from "../MiddlePanel"
import { Route, Switch } from "react-router-dom";
import "../../index.css"

function RightPanel() {


    return (
        <div className="mrg-l-10px">
            <div>GROUP BALANCES</div>
            <div>feature coming soon....</div>
        </div>
    )
}

export default RightPanel;
