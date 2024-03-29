import React from "react";





function SplashPage() {

    return (
        <>
            <div className="backgroud-img height-80-per min-width-600px min-height-500px">
                <div className="flx mrg-0-auto">
                    <div className="welcome margin-30px-left-right">
                        <h2> Welcome to SplitEZ !</h2>
                        {/* <div className="text-align-j">We understand your pain point - no body wants to do the math when hangs out with your friends, splitting bills can be a cumbersome process, and no one wants to spend time doing calculations. This application would be your best partner to make it easier for you to manage your spending.</div>
                         */}
                        <div className="text-align-j">We understand your pain - nobody wants to do the math when hanging out with friends, splitting bills can be a cumbersome process, and no one wants to spend time doing calculations. This application would be your best partner to make it easier for you to manage your spending.</div>

                        {/* <h3 className="welcome">SplitEZ makes it easy to split bills with friends and family!!</h3> */}
                        <img className="display-b" src={"https://www.louisianafcu.org/hs-fs/hubfs/Blog_The%20polite%20persons%20guide%20to%20splitting%20the%20bill%20(558%20%C3%97%20325%20px).png?width=837&name=Blog_The%20polite%20persons%20guide%20to%20splitting%20the%20bill%20(558%20%C3%97%20325%20px).png"} alt="img" />
                    </div>
                </div>


            </div>
            <footer className="height-20-per min-width-600px">
                <small>
                    Developer:
                    <div className="flx">
                        <div>Penny Wang</div>
                        <div>
                            <a href="https://github.com/pennywangpw" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/yi-ping-penny-wang-40654114b/" target="_blank">
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>

                </small>


            </footer>

        </>
    )
}

export default SplashPage;
