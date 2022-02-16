#REXT-REDUX

Module created with the help of Redux and Redux-saga. This module will save our time, to write reducer and there actions.

Take a real life example, Let suppose you want to hit and API and want to update there result in store and get the state in the component

So you would required following steps 
1. Create the actions
2. You will create the reducer state
3. Define the API functions
4. Check the reducer action type and update the result accordingly.

And if you have multiple API, You will repeat the steps again and again.

To overcome this situations we have build this package which will save above points.

To connect to server we required token as well as base url, For that create two method in you selector folder

```
export function getBaseUrl (state: any): string {
    return <YOUR BASE URL or if not base url return empty string>;
} 

export function getToken (state: any): string {
    return <YOUR TOKEN or IT CAN HAVE EMPTY STRING ALSO>;
} 
```

Create rext.ts where you will create the rext object
```

```