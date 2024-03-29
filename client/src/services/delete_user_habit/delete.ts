interface valuesSentToDeleteUserHabitBackend {
  habitGoingToBeDelete: {
    habit_count:number,
    user_habit:string,
  }
  user_id:number
}
export async function deleteUserHabitAPI(valuesSentToDeleteUserHabitBackend:valuesSentToDeleteUserHabitBackend) {
  console.log("🚀 ~ file: delete.ts:2 ~ deleteUserHabitAPI ~ valuesSentToDeleteUserHabitBackend:", valuesSentToDeleteUserHabitBackend)
  
  const valuesQueryString = encodeURIComponent(JSON.stringify(valuesSentToDeleteUserHabitBackend));
  const deleteUserHabitUrl = `http://127.0.0.1:5000/delete_user_habit?valuesSentToDeleteUserHabitBackend=${valuesQueryString}`

  const response = await fetch(deleteUserHabitUrl, {
    method:"DELETE",
    headers: {
      'Content-Type':'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin':'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
    }
  })
  const data = await response.json()
}