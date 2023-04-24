import React, { useState } from "react";
import LeftPanel from "../LeftPanel";
import ExpensesList from "../MiddlePanel"
import { Route, Switch } from "react-router-dom";
import "../../index.css"

function RightPanel() {


    return (
        <div className="panelborder">
            This is RightPanel

        </div>
    )
}

export default RightPanel;
