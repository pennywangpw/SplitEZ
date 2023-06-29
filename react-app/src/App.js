import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage"
import MainPage from "./components/MainPage"
import PageNotFound from "./components/PageNotFound"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const currentuser = useSelector((state) => state.session.user);


  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/all">
            {currentuser ? <MainPage /> : <SplashPage />}
          </Route>
          <Route path="/groups/:groupId">
            {currentuser ? <MainPage type="group" /> : <SplashPage />}
          </Route>
          <Route path="/friends/:friendId">
            {currentuser ? <MainPage type="friend" /> : <SplashPage />}
          </Route>
          <Route exact path="/">
            <SplashPage />
          </Route>
          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
