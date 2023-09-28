import { NextResponse } from 'next/server';


export async function GET(request) {
    console.log('hit')
    const renderId = 1; // replace with the actual render id
    const endpoint = `https://api.shineon.com/v1/v1/renders/${renderId}/make`; // replace with the base URL of your API
  
    const requestBody = await request.json();
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SHINE_ON_API}`  // Using the environment variable for authorization
    };

    try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: headers,
        });
    const responseData = await response.json();
  
    return NextResponse.json(responseData);

    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
  
    console.log('working')
    const responseData = await response.json();
  
    // Handle the response data based on your application's needs
    if (response.status !== 200) {
      // Handle error cases based on the response status
      console.error("Error occurred:", responseData);
    }
  
    return NextResponse.json(responseData);
  }