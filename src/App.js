import React from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";
import { Beforeunload } from 'react-beforeunload';

import PersonalityPage from "./components/PersonalityPage/PersonalityPage";
import SelectMoviesPage from "./components/SelectMoviesPage/SelectMoviesPage";
import CommonRatePage from "./components/CommonRatePage/CommonRatePage";
import ReviewPage from "./components/ReviewPage/ReviewPage";
import ReviewoverallPage from "./components/ReviewoverallPage/ReviewoverallPage";
import AskEmailPage from "./components/AskEmailPage/AskEmailPage";
import EmailPage from "./components/EmailPage/EmailPage";
import RatePage from "./components/RatePage/RatePage";
import EndPage from "./components/EndPage/EndPage";
import ErrorPage from "./ErrorPage";

import { string, object, number, array } from 'yup';
import survey from "./Data/survey";

const num = number().moreThan(-1).required().integer();
const str = string().required();
const obj = o => object().shape(o);

const _personality = obj({
  talkative: num,
  faultWithOthers: num,
  thoroughJob: num,
  depressed: num
});

const _movie = array().of(obj({
  "name": str,
  "img": str
})).min(0);

const _navSeq = array().of(obj({
  "movieid": num,
  "ratingstyle": str
})).min(0);

const _reviewSeq = array().of(num).min(0);

const _ratedMovie = array().of(obj({
  "name": str,
  "img": str,
  "commonRate": num,
  "color-circle": num,
  "color-star": num,
  "color-emoji": num,
  "circle": num,
  "emoji": num
})).min(0);

const _reviewedMovie = array().of(obj({
  "name": str,
  "img": str,
  "commonRate": num,
  "color-circle": num,
  "color-star": num,
  "color-emoji": num,
  "circle": num,
  "emoji": num,
  "chosenRatings": array().of(num).min(1)
})).min(0);

const _reviewOverall = num;

const selectSchema = obj({
  personality: _personality
});

const commonSchema = obj({
  personality: _personality,
  selectedMovies: _movie,
  navSequence: _navSeq
});

const rateSchema = commonSchema;

const reviewoverallSchema = obj({
  personality: _personality,
  selectedMovies: _ratedMovie
});

const reviewEachSchema = obj({
  personality: _personality,
  selectedMovies: _ratedMovie,
  reviewOverall: _reviewOverall,
  reviewSequence : _reviewSeq
});

const emailSchema = obj({
  personality: _personality,
  selectedMovies: _reviewedMovie,
  reviewOverall: _reviewOverall
});

const askEmailSchema = emailSchema;

const endSchema = emailSchema;

const schemas = {
  "/select": selectSchema,
  "/common": commonSchema,
  "/rate/:movieid/:ratingstyle": rateSchema,
  "/reviewoverall": reviewoverallSchema,
  "/review/:movieid": reviewEachSchema,
  "/askemail": askEmailSchema,
  "/email": emailSchema,
  "/end": endSchema
};

function RestrictedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render = {
        props => {
          const schema = schemas[props.match.path];
          if (!schema) {
            return <Redirect
              to={{
                pathname: "/error",
                state: { from: props.location }
              }}
            />
          }

          let transition;
          try {
            schema.validateSync(survey.get());
            transition = <Component {...props} />
          } catch(err) {
            alert(err);
            transition = <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          }

          return transition;
        }
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
      <Beforeunload onBeforeunload={() => "Survey data can be loss, are you sure?"}>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={PersonalityPage} />
            <Route exact path="/error" component={ErrorPage} />
            <RestrictedRoute exact path="/select" component={SelectMoviesPage} />
            <RestrictedRoute exact path="/common" component={CommonRatePage} />
            <RestrictedRoute exact path="/reviewoverall" component={ReviewoverallPage} />
            <RestrictedRoute exact path="/askemail" component={AskEmailPage} />
            <RestrictedRoute exact path="/email" component={EmailPage} />
            <RestrictedRoute exact path="/end" component={EndPage} />
            <RestrictedRoute exact path="/rate/:movieid/:ratingstyle" component={RatePage} />
            <RestrictedRoute exact path="/review/:movieid" component={ReviewPage} />
          </Switch>
        </HashRouter>
      </Beforeunload>
    );
  }
}