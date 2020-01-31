import React from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";

import PersonalityPage from "./components/PersonalityPage/PersonalityPage";
import SelectMoviesPage from "./components/SelectMoviesPage/SelectMoviesPage";
import CommonRatePage from "./components/CommonRatePage/CommonRatePage";
import ReviewPage from "./components/ReviewPage/ReviewPage";
import ChooseRatePage from "./components/ChooseRatePage/ChooseRatePage";
import EmailPage from "./components/EmailPage/EmailPage";
import RatePage from "./components/RatePage/RatePage";
import Auth from "./stores/auth";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.loggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

// <PrivateRoute exact path="/orders/include" component={IncludePage} />
// Followed https://github.com/gothinkster/react-mobx-realworld-example-app
// To adopt mobx faster later on
export default class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/personality" component={PersonalityPage} />
          <Route exact path="/select" component={SelectMoviesPage} />
          <Route exact path="/common" component={CommonRatePage} />
          <Route exact path="/review" component={ReviewPage} />
          <Route exact path="/choose" component={ChooseRatePage} />
          <Route exact path="/email" component={EmailPage} />
          <Route exact path="/rate/:movieid/:ratingstyle" component={RatePage} />
        </Switch>
      </HashRouter>
    );
  }
}