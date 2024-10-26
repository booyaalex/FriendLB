import './App.css';
import { useState, useEffect } from 'react';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ughstfzbqkwwurstknii.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaHN0ZnpicWt3d3Vyc3RrbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5OTUwMTUsImV4cCI6MjA0NDU3MTAxNX0.cu67rZh9rNVouXFZpa5ypYiYFz8EUGAIH8dMDMy9TDo');

export function App() {
  const [state, setState] = useState([]);
  useEffect(() => {
    getUserData().then((r) => {
      //Rank scores from greatest to least
      const userArray = [];
      const userMap = new Map();
      for (let i = 0; i < r.length; i++) {
        userArray.push(Number(r[i].totalWins.total) + (i * 0.00001)); //By making each score unique, you can use a map to get a users data by their score.
        userMap.set(userArray[i], r[i]);
      }
      userArray.sort(function (a, b) { return b - a; }); //Sorts integers in array GTL

      //Put scores into HTML
      const elements = [];
      for (let i = 0; i < userArray.length; i++) {
        let specialRanking;
        if(i == 0) {
          specialRanking = "gold";
        } else if(i == 1) {
          specialRanking = "silver";
        } else if(i == 2) {
          specialRanking = "bronze";
        }  
        elements.push(
          <div key={userMap.get(userArray[i]).id} className={"ranking " + specialRanking + " center"}>
            <div className="flex verticalCenter">
              <p>#{i + 1}:</p>
              <p>{userMap.get(userArray[i]).userName}: {userMap.get(userArray[i]).totalWins.total}</p>
            </div>
          </div>
        );
      }
      setState(elements);
    });
  }, [state]); //To put it simply, useEffect can be used to update values that are unsyncronized, or come from async functions. Hard to explain.

  return (
    <>
      <h1 className="textCenter">Friend Leaderboards</h1>
      <h2 className="textCenter">Current Standings</h2>
      <div>
        {state}
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
    //window.location.href = "./";
  }
}

async function getUserData() {
  const { data, error } = await supabase.from('Users').select();
  return data;
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
    const { error2 } = await supabase.from('Users').insert({ id: data.user.id, userName: data.user.user_metadata.userName, totalWins: { "total": 0, "domino": 0, "crazyEight": 0 } });
    if (error2) {
      alert(error2);
    }
    document.getElementById("confirmation").innerHTML = "Check your email to activate your account! Then log in!";
  }
}

async function userLogOut() {
  const { error } = await supabase.auth.signOut();
}