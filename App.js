import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignupScreen';
import StepCounter from './StepCounter'; // Main screen after login

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="StepCounter" component={StepCounter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;






// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { onAuthStateChanged } from 'firebase/auth'; // Firebase authentication method
// import { auth } from './firebaseConfig'; // Firebase config
// import LoginScreen from './LoginScreen';
// import SignupScreen from './SignupScreen';
// import StepCounter from './StepCounter';
// import LeaderboardScreen from './LeaderboardScreen'; // Import Leaderboard screen

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [user, setUser] = useState(null); // To track the logged-in user

//   // Check user authentication state on app load
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user); // User is logged in
//       } else {
//         setUser(null); // User is not logged in
//       }
//     });

//     return unsubscribe; // Clean up the listener on unmount
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {user ? (
//           <>
//             {/* If user is logged in, show StepCounter and Leaderboard */}

//             <Stack.Screen name="StepCounter" component={StepCounter} />
//             <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
//           </>
//         ) : (
//           // If user is not logged in, show Login and Signup screens
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Signup" component={SignupScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// {/* <Stack.Navigator>
// {user ? (
//   <>
//     {/* If user is logged in, show StepCounter and Leaderboard */}
//     // <Stack.Screen name="StepCounter" component={StepCounter} />
//     // <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
//   // </>
// // ) : (
//   // If user is not logged in, show Login and Signup screens
//   // <>
//   //   <Stack.Screen name="Login" component={LoginScreen} />
//   //   <Stack.Screen name="Signup" component={SignupScreen} />
//   // </>
// // )}
// // </Stack.Navigator>
// // </NavigationContainer> */}


// //<Stack.Screen name="Login" component={LoginScreen} />
// //<Stack.Screen name="Signup" component={SignupScreen} />
// //<Stack.Screen name="StepCounter" component={StepCounter} />
// //<Stack.Screen name="Leaderboard" component={LeaderboardScreen} /> 