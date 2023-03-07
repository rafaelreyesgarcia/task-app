import React, { useEffect, useState } from "react"
import Auth from "./components/Auth";
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [tasks, setTasks] = useState(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;

  const getData = async () => {
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/${userEmail}`)
      const json = await response.json()
      console.log(json);
      setTasks(json);
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, [])

  // sort by date
  const sortedTasks = tasks?.sort((a, b) => {
    new Date(a.date) - new Date(b.date)
  })

  // console.log(sortedTasks);

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={'🏖️ Holiday list'} getData={getData}/>
          <p className="user-email">welcome back! {userEmail}</p>
          {sortedTasks?.map((task) => <ListItem key={task.date} task={task} getData={getData}/>)}
          <p className="copyright">&copy; rafael 2023</p>
        </>
      )}
    </div>
  )
}

export default App
