import React from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";
import { Beforeunload } from 'react-beforeunload';

import PersonalityPage from "./components/PersonalityPage/PersonalityPage";
import SadHappyPage from "./components/SadHappyPage/SadHappyPage";
import CommonRatePage from "./components/CommonRatePage/CommonRatePage";
import ExplainReviewPage from "./components/ExplainReviewPage/ExplainReviewPage";
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

const sadHappy1Schema = obj({
  personality: _personality
});

const commonSchema = obj({
  personality: _personality,
  selectedMovies: _movie,
  navSequence: _navSeq,
  sadhappy1: str
});

const rateSchema = commonSchema;

const sadHappy2Schema = commonSchema;

const reviewoverallSchema = obj({
  personality: _personality,
  selectedMovies: _ratedMovie,
  sadhappy1: str,
  sadhappy2: str
});

const sadHappy3Schema = reviewoverallSchema;

const reviewEachSchema = obj({
  personality: _personality,
  selectedMovies: _ratedMovie,
  reviewOverall: _reviewOverall,
  reviewSequence : _reviewSeq,
  sadhappy1: str,
  sadhappy2: str,
  sadhappy3: str
});

const explainReviewSchema = reviewEachSchema;

const emailSchema = obj({
  personality: _personality,
  selectedMovies: _reviewedMovie,
  reviewOverall: _reviewOverall,
  sadhappy1: str,
  sadhappy2: str,
  sadhappy3: str
});

const askEmailSchema = emailSchema;

const endSchema = emailSchema;

const schemas = {
  "/sadhappy1": sadHappy1Schema,
  "/sadhappy2": sadHappy2Schema,
  "/sadhappy3": sadHappy3Schema,
  "/common": commonSchema,
  "/rate/:movieid/:ratingstyle": rateSchema,
  "/reviewoverall": reviewoverallSchema,
  "/explainreview": explainReviewSchema,
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

            switch(props.match.path) {
              case "/sadhappy1":
                props.saveAs = "sadhappy1";
                props.nextRoute = "/common";
                break;
              case "/sadhappy2":
                props.saveAs = "sadhappy2";
                const { movieid, ratingstyle } = survey.get().navSequence.pop();
                props.nextRoute = `/rate/${movieid}/${ratingstyle}`;
                break;
              case "/sadhappy3":
                props.saveAs = "sadhappy3";
                props.nextRoute = "/reviewoverall";
                break;
              default: break;
            }

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
            <RestrictedRoute exact path="/sadhappy1" component={SadHappyPage} />
            <RestrictedRoute exact path="/sadhappy2" component={SadHappyPage} />
            <RestrictedRoute exact path="/sadhappy3" component={SadHappyPage} />
            <RestrictedRoute exact path="/common" component={CommonRatePage} />
            <RestrictedRoute exact path="/reviewoverall" component={ReviewoverallPage} />
            <RestrictedRoute exact path="/explainreview" component={ExplainReviewPage} />
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