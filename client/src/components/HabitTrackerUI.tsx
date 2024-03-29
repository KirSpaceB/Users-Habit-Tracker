import React, { useEffect } from "react";
import styles from '../styles/HabitTrackerUI.module.css';
import {useState} from "react"
import {
  getUserHabits,
  postSendUserHabits,
  getDecodedUserId,
  deleteUserHabitAPI,
  updateCountClientAPI,
  incrementDisplayCount 
} from "../services";
// As long as we don't need to import types and interfaces we don't need to separate them in a different file
type Todo = {
  text: string,
  count: number,
}

interface displayHabitsInterface {
  habit_count:number,
  user_habit:string
}

type IdisplayHabitArrayType = displayHabitsInterface[]

const HabitTrackerUI = () => {
  const [input, setInput] = useState<string>('')
  // We can map habits because it is an array of objects
  const [habits, setHabits] = useState<Todo[]>([])

  const [displayHabits, setDisplayHabits] = useState<IdisplayHabitArrayType>([]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if the habit already exists, if yes, return without adding a duplicate
    const newHabit = { text: input, count: 1 };
    // Habits takes input as one of the values which is another state 
    const updatedHabits = [...habits, { text: input, count: 1 }];

    setHabits(updatedHabits);

    const decodedTokenUserId = await getDecodedUserId();

    if (!decodedTokenUserId) {
      console.log('THERES A TOKEN MISSING IN HANDLESUBMIT AT HABITTRACKERUI')
    }
    postSendUserHabits(newHabit, decodedTokenUserId);
  };
  
  const handleIncrement = async (index: number) => {
    
    const updatedHabits = [...habits];

    const incrementIndex = updatedHabits[index].count++;
    const habit = updatedHabits[0].text;
    console.log("🚀 ~ file: HabitTrackerUI.tsx:50 ~ handleIncrement ~ habit:", habit)
    const user_id = await getDecodedUserId()
    updateCountClientAPI(habit,user_id, incrementIndex);
    setHabits(updatedHabits);
  };

  const handleDeleteUIHabit = (index:number) => {
    const updatedHabits = [...displayHabits];
    updatedHabits.splice(index, 1)
    setDisplayHabits(updatedHabits)
  };

  const handleDeleteFetchedHabit = async (habitToDelete:displayHabitsInterface) => {
    console.log("🚀 ~ file: HabitTrackerUI.tsx:70 ~ handleDeleteFetchedHabit ~ habitToDelete:", habitToDelete)
    const updatedHabits = displayHabits.filter(habit => habit !== habitToDelete);
    const userIdSentToDeleteUserHabitAPI = await getDecodedUserId();
    setDisplayHabits(updatedHabits)

    const valuesSentToDeleteUserHabitAPI = 
    {
      user_id:userIdSentToDeleteUserHabitAPI,
      habitGoingToBeDelete:habitToDelete
    }
    console.log('%c valuesSentToDeleteUserHabitAPI', 'color:red;', valuesSentToDeleteUserHabitAPI);
    deleteUserHabitAPI(valuesSentToDeleteUserHabitAPI)
  };


  const handleIncrementFetchHabitCount = async (incrementedNumber:number) => {
    const updatedHabits = [...displayHabits];
    const incrementNumber = updatedHabits[incrementedNumber].habit_count++;
    const decodedUserID = await getDecodedUserId();
    const habitToSendForValidation = updatedHabits[incrementedNumber].user_habit;
    
    setDisplayHabits(updatedHabits)
    incrementDisplayCount(decodedUserID,habitToSendForValidation,incrementNumber)
  };

  useEffect(() => {
    // Gets userHabits from DB
    const gettingUserHabit = async () => {
      const awaitForGetRequest = await getUserHabits()
      setDisplayHabits(awaitForGetRequest)
    }
    gettingUserHabit()
  },[]);

  console.log('%c displayed habits useState variable','color: red;',displayHabits)
  return (
    <div className={styles.HabitTrackerUI_screen_container}>
      <form>
        <input
          type="text"
          placeholder="Add a habit"
          value={(input)}
          onChange={(e) => setInput(e.target.value)}
          name="text"
          className={styles.HabitTrackerUI_form_input_element}
        ></input>
        <button 
        type="button" 
        onClick={handleSubmit} 
        className={styles.HabitTrackerUI_form_add_habit_btn}
        >
        Add Habit
        </button>
      </form>

      {/* Rendering UI-only habits */}
      <ul>
        {/* Abstract */}
        {habits.map((habit, index) => (
          // This should be one single array in order to display all necessary habits no two separate ones
          // We should just add it to display habits
          // We can use context on display habits, therefore allowing us to use it in multiple places in the application
          <li key={index}>
            {habit.text} {habit.count}
            <button onClick={() => handleIncrement(index)}>Increment</button>
            <button onClick={() => handleDeleteUIHabit(index)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Rendering fetched habits */}
      {displayHabits ? (
        <ul>
          {displayHabits.map((habit, index) => (
            <li key={index}>
              {habit.user_habit} {habit.habit_count}
              <button
              onClick={() => handleIncrementFetchHabitCount(index)}>
              Increment
              </button>

              <button 
              onClick={() => handleDeleteFetchedHabit(habit)}>
              Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Please Add a Habit</p>
      )}
    </div>
  )
}

export default HabitTrackerUI