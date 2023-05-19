import React from "react";





function SplashPage() {

    return (
        <>
            <div className="backgroud-img height-88vh">
                <div>
                    <h1 className="welcome"> Welcome to SplitEZ !</h1>
                    <h3 className="welcome">We understand your pain point - no body wants to do the math when hangs out with your friends, splitting bills can be a cumbersome process, and no one wants to spend time doing calculations. This application would be your best partner to make it easier for you to manage your spending.</h3>
                    {/* <h3 className="welcome">SplitEZ makes it easy to split bills with friends and family!!</h3> */}
                    <img className="mrg-l-180px" src={"https://www.louisianafcu.org/hs-fs/hubfs/Blog_The%20polite%20persons%20guide%20to%20splitting%20the%20bill%20(558%20%C3%97%20325%20px).png?width=837&name=Blog_The%20polite%20persons%20guide%20to%20splitting%20the%20bill%20(558%20%C3%97%20325%20px).png"} alt="img" />

                </div>
            </div>
        </>
    )
}

export default SplashPage;
