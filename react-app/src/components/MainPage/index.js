import React, { useState } from "react";
import LeftPanel from "../LeftPanel";
import ExpensesList from "../MiddlePanel"
import ExpensesListByGroup from "../MiddlePanelByGroup"
import RightPanel from "../RightPanel";
import { Route, Switch } from "react-router-dom";
import "../../index.css"

function MainPage({ type }) {


    return (
        <div className="grid-3fr height-88vh fontS-13px height-18px height-min ">
            <LeftPanel />
            {type === "group" ? <ExpensesListByGroup /> : <ExpensesList />}
            <RightPanel />
        </div>
    )
}

export default MainPage;
