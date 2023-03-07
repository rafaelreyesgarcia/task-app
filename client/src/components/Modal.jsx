import React, { useState } from 'react'
import { useCookies } from 'react-cookie';

const Modal = ({mode, setShowModal, getData, task}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = mode === 'edit' ? true : false
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : '',
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date()
  });

  // POST data

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        console.log('POSTED')
        setShowModal(false)
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // PUT data
  const editData = async(e) => {
    e.preventDefault()
    try {
      // console.log('fethcing...')
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/todos/${task.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        setShowModal(false);
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    // console.log('changing', e);
    const { name, value } = e.target;
    setData(data => ({
      ...data, // spread operator for shallow copies
      [name] : value // computed variables useful at runtime
    }));
  }
  console.log('data from modal:', data);

  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='form-title-container'>
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            type="text"
            required
            maxLength={30}
            placeholder='your task goes here'
            name='title'
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label htmlFor='range'>Drag to select your current progress</label>
          <input
            required
            type="range"
            id='range'
            min='0'
            max='100'
            name='progress'
            value={data.progress}
            onChange={handleChange}
          />
          <input
            className={mode}
            type="submit"
            onClick={editMode ? editData : postData}
          />
        </form>
      </div>
    </div>
  )
}

export default Modal