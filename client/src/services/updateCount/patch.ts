interface payloadSentToBackendInterface {
  user:number
  count:number
}
export async function updateCountClientAPI(userID:number, incrementedCount:number) {
  console.log("🚀 ~ file: patch.ts:6 ~ updateCountClientAPI ~ userID:", userID)
  const payload:payloadSentToBackendInterface = {
    user:userID,
    count:incrementedCount
  };
  const requestHeaders = {
    method:'PATCH',
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Credentials": "http://localhost:5174"    
      },
      body:JSON.stringify({'payload':payload})
    };
  const response = await fetch(
  'http://127.0.0.1:5000/updateCountDb',{
    method:requestHeaders.method,
    headers:requestHeaders.headers,
    body:requestHeaders.body,
  }
);
  const turnResponseToJSON = await response.json();
  console.log(turnResponseToJSON);
}