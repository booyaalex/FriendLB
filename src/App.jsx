import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './App.css';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ughstfzbqkwwurstknii.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaHN0ZnpicWt3d3Vyc3RrbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5OTUwMTUsImV4cCI6MjA0NDU3MTAxNX0.cu67rZh9rNVouXFZpa5ypYiYFz8EUGAIH8dMDMy9TDo');

export function App() {
  const [state, setState] = useState([]);
  const [games, setGames] = useState([]);
  useEffect(() => {
    getUserData().then((r) => {

      const getTotalScores = sortScores(r, "total");
      const userArray = getTotalScores.array;
      const userMap = getTotalScores.map;

      //Put Total Score rankings into HTML
      const rankingElements = [];
      for (let i = 0; i < userArray.length; i++) {
        let specialRanking;
        if (i == 0) {
          specialRanking = "gold";
        } else if (i == 1) {
          specialRanking = "silver";
        } else if (i == 2) {
          specialRanking = "bronze";
        }
        rankingElements.push(
          <div key={userMap.get(userArray[i]).id} className={"ranking " + specialRanking + " center"} onClick={accountSelect.bind(this, userMap.get(userArray[i]).userName)}>
            <div className="flex verticalCenter">
              <p>#{i + 1}:</p>
              <p>{userMap.get(userArray[i]).userName}: {userMap.get(userArray[i]).totalWins.total}</p>
            </div>
          </div>
        );
      }
      setState(rankingElements);

      const allGames = Object.keys(userMap.get(userArray[0]).totalWins);
      allGames.splice(allGames.indexOf("total"), 1);

      /* Put Games rankings into HTML; 
      i = game; j = user; */
      const allGameElements = [];
      for (let i = 0; i < allGames.length; i++) {
        const getGameScores = sortScores(r, allGames[i]);
        const gameArray = getGameScores.array;
        const gameMap = getGameScores.map;

        const gameElements = [];
        for (let j = 0; j < (gameArray.slice(0, 3)).length; j++) {
          let specialRanking;
          if (j == 0) {
            specialRanking = "gold";
          } else if (j == 1) {
            specialRanking = "silver";
          } else if (j == 2) {
            specialRanking = "bronze";
          }
          gameElements.push(
            <div key={gameMap.get(gameArray[j]).id} className={"ranking " + specialRanking + " center"}>
              <div className="flex verticalCenter">
                <p>#{j + 1}:</p>
                <p>{gameMap.get(gameArray[j]).userName}: {gameMap.get(gameArray[j]).totalWins[allGames[i]]}</p>
              </div>
            </div>
          );
        }

        allGameElements.push(
          <div id={allGames[i]} className="center" key={allGames[i]} onClick={gameSelect.bind(this, allGames[i])}>
            <h3 className="textCenter">{allGames[i].charAt(0).toUpperCase() + allGames[i].slice(1)}</h3>
            {gameElements}
          </div>
        );
      }
      setGames(allGameElements);
    });
  }, [state, games]); //To put it simply, useEffect can be used to update values that are unsyncronized, or come from async functions. Hard to explain.

  return (
    <>
      <h1 className="textCenter">Friend Leaderboards</h1>
      <h2 className="textCenter">Current Standings</h2>
      <div className="mainRankings">
        {state}
      </div>
      <br />
      <h2 className="textCenter">All Games</h2>
      <div className="subRankings">
        {games}
      </div>
    </>
  );
}

export function Account() {
  let params = useParams();

  const [account, setAccount] = useState([]);
  const [wins, setWins] = useState([]);
  useEffect(() => {
    getUserData().then((r) => {
      let user;
      for (let i = 0; i < r.length; i++) {
        if (r[i].userName == params.user) {
          user = r[i];
          break;
        }
      }
      setAccount(user);

      const elements = [];
      const winsObj = Object.keys(user.totalWins);
      for (let i = 0; i < winsObj.length; i++) {
        elements.push(
          <h4 key={winsObj[i]}>
            {winsObj[i].charAt(0).toUpperCase() + winsObj[i].slice(1)}: {user.totalWins[winsObj[i]]}
          </h4>
        );
      }
      setWins(elements);
    });
  }, [account, wins]);

  return (
    <>
      <div className="user flex">
        <img id="profileImg" src={account.profileImage} alt="Profile Image" onClick={changeProfileImage.bind()} />
        <h1 className="textCenter">{account.userName}</h1>
      </div>
      <br />
      <div>
        <h2>Stats:</h2>
        <div>{wins}</div>
      </div>
    </>
  );
}

export function Game() {
  let params = useParams();

  const [games, setGames] = useState([]);
  useEffect(() => {
    getUserData().then((r) => {
      const getTotalScores = sortScores(r, params.game);
      const userArray = getTotalScores.array;
      const userMap = getTotalScores.map;

      const elements = [];
      for (let i = 0; i < userArray.length; i++) {
        let specialRanking;
        if (i == 0) {
          specialRanking = "gold";
        } else if (i == 1) {
          specialRanking = "silver";
        } else if (i == 2) {
          specialRanking = "bronze";
        }
        elements.push(
          <div key={userMap.get(userArray[i]).id} className={"ranking " + specialRanking + " center"} onClick={accountSelect.bind(this, userMap.get(userArray[i]).userName)}>
            <div className="flex verticalCenter">
              <p>#{i + 1}:</p>
              <p>{userMap.get(userArray[i]).userName}: {userMap.get(userArray[i]).totalWins[params.game]}</p>
            </div>
          </div>
        );
      }
      setGames(elements);
    });
  }, [games]);

  return (
    <>
      <h1 className="textCenter">{(params.game).charAt(0).toUpperCase() + (params.game).slice(1)}</h1>
      <h2 className="textCenter">Current Standings</h2>
      <div>
        {games}
      </div>
    </>
  );
}

export function LogIn() {
  return (
    <>
      <h1 className="textCenter">Log In</h1>
      <br />
      <input id="emailInput" className="textInput" type="email" placeholder="email"></input>
      <input id="passwordInput" className="textInput" type="password" placeholder="password"></input>
      <button type="submit" onClick={userLogIn.bind()}>Log In</button>
      <br />
      <a href="./signup">Sign Up</a>
    </>
  );
}

export function SignUp() {
  return (
    <>
      <h1 className="textCenter">Sign Up</h1>
      <input id="usernameInput" className="textInput" type="text" placeholder="username"></input>
      <br />
      <input id="emailInput" className="textInput" type="email" placeholder="email"></input>
      <br />
      <input id="passwordInput" className="textInput" type="password" placeholder="password"></input>
      <br />
      <p>I can see your passwords, so don't use the password you normally use.</p>
      <button type="submit" onClick={userSignUp.bind()}>Sign Up</button>
      <br />
      <a href="./login">Log In</a>
      <p id="confirmation"></p>
    </>
  );
}

export function LogOut() {
  userLogOut();
  return (
    <>
      <p>Successfully logged out!(Hopefully)</p>
      <a href="./">Go Home</a>
    </>
  );
}

async function getUserData() {
  const { data, error } = await supabase.from('Users').select();
  return data;
}

function sortScores(scores, game) {
  const scoreArray = [];
  const scoreMap = new Map();
  for (let i = 0; i < scores.length; i++) {
    scoreArray.push(Number(scores[i].totalWins[game]) + (i * 0.00001)); //By making each score unique, you can use a map to get a users data by their score.
    scoreMap.set(scoreArray[i], scores[i]);
  }
  scoreArray.sort(function (a, b) { return b - a; }); //Sorts integers in array GTL

  const returnValue = {
    array: scoreArray,
    map: scoreMap
  }
  return returnValue; //To return multiple values, I made an object to store an array, and a map.
}

const accountSelect = (user) => {
  window.location.href = `../account/${user}`;
}
const gameSelect = (game) => {
  window.location.href = `../game/${game}`;
}

async function changeProfileImage() {
  if (JSON.parse(localStorage.getItem("sb-ughstfzbqkwwurstknii-auth-token")).user.user_metadata.userName == window.location.pathname.replace('/account/', '')) {
    const url = window.prompt("Enter the url of the image you want as your profile picture.");
    if (url) {
      const { updateError } = await supabase.from('Users').upsert({ id: JSON.parse(localStorage.getItem("sb-ughstfzbqkwwurstknii-auth-token")).user.id, userName: JSON.parse(localStorage.getItem("sb-ughstfzbqkwwurstknii-auth-token")).user.user_metadata.userName, profileImage: url });
      if (updateError) {
        console.error("Error", error);
      }
    }
  }
}

async function userLogIn() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
    options: {
      emailRedirectTo: './'
    }
  });
  console.log(data);
  if (error) {
    alert(error);
  } else {
    window.location.href = "./";
  }
}

async function userSignUp() {
  const username = document.getElementById("usernameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      shouldCreateUser: false,
      data: {
        userName: username,
      }
    }
  });
  if (error) {
    alert(error);
  } else {
    const { error2 } = await supabase.from('Users').insert({ id: data.user.id, userName: data.user.user_metadata.userName, totalWins: { "total": 0, "domino": 0, "crazyEights": 0 } });
    if (error2) {
      alert(error2);
    }
    document.getElementById("confirmation").innerHTML = "Check your email to activate your account! Then log in!";
  }
}

async function userLogOut() {
  const { error } = await supabase.auth.signOut();
}