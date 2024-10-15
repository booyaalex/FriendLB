import './App.css';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ughstfzbqkwwurstknii.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaHN0ZnpicWt3d3Vyc3RrbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5OTUwMTUsImV4cCI6MjA0NDU3MTAxNX0.cu67rZh9rNVouXFZpa5ypYiYFz8EUGAIH8dMDMy9TDo');

export function App() {
  return (
    <>
      <h1>Friend Leaderboards</h1>
    </>
  );
}

export function SignUp() {
  return (
    <>
      <h1>Sign Up</h1>
      <input id="usernameInput" type="text" placeholder="username"></input>
      <br />
      <input id="emailInput" type="email" placeholder="email"></input>
      <br />
      <input id="passwordInput" type="password" placeholder="password"></input>
      <br />
      <p>I can see your passwords, so don't use the password you normally use.</p>
      <button type="submit" onClick={userSignUp.bind()}>Sign Up</button>
    </>
  );
}

async function userSignUp() {
  const username = document.getElementById("usernameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        userName: username,
        password: password,
      }
    }
  });
}