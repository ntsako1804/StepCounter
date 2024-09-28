import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Platform, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Device from 'expo-device';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import icons
import RingProgress from './RingProgress'; // Import the custom RingProgress component
import { AntDesign } from '@expo/vector-icons';

const StepCounter = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [stepCount, setStepCount] = useState(0);
  const [distance, setDistance] = useState(0); // Distance in meters
  const [calories, setCalories] = useState(0); // Calories burned
  const [stepTarget, setStepTarget] = useState(10000); // Default step target
  const [strideLength, setStrideLength] = useState(0.78); // Default stride length
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date for tracking steps

  useEffect(() => {
    let subscription;

    const startPedometer = async () => {
      try {
        if (Platform.OS === 'android' && Device.osBuildId >= 29) {
          const status = await Pedometer.requestPermissionsAsync();
          if (!status.granted) {
            console.log("Permission denied");
            return;
          }
        }

        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
          subscription = Pedometer.watchStepCount(result => {
            setStepCount(result.steps);
            calculateDistanceAndCalories(result.steps);
          });
        }
      } catch (error) {
        console.error("Error in starting pedometer: ", error);
      }
    };

    startPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [selectedDate, strideLength]); // Re-run whenever the selected date or stride length changes

  const calculateDistanceAndCalories = (steps) => {
    const distanceInMeters = steps * strideLength;
    const caloriesBurned = steps * 0.04;  // Roughly 0.04 calories per step
    setDistance(distanceInMeters);
    setCalories(caloriesBurned);
  };

  // Date navigation handlers
  const goToPreviousDay = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  // Calculate progress towards the step target
  const progress = stepCount / stepTarget;

  return (
    <View style={styles.container}>
      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={goToPreviousDay}>
          <AntDesign name="leftcircle" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        <TouchableOpacity onPress={goToNextDay}>
          <AntDesign name="rightcircle" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Ring Progress */}
      <View style={styles.ringContainer}>
        <RingProgress
          radius={120}
          strokeWidth={30}
          progress={progress > 1 ? 1 : progress}
        />
        {/* Step Icon Inside the Ring */}
        <View style={styles.stepIconContainer}>
          <Ionicons name="walk" size={50} color="#FF3366" />
        </View>
      </View>

      {/* Steps Info */}
      <Text style={styles.stepCountText}>{stepCount} steps</Text>
      <Text style={styles.stepGoalText}>Goal: {stepTarget} steps</Text>

      {/* Distance and Calories Display */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="walk" size={24} color="#FF3366" />
          <Text style={styles.statsText}>
            {distance.toFixed(2)} meters
          </Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="fire" size={24} color="#FF3366" />
          <Text style={styles.statsText}>
            {calories.toFixed(2)} kcal
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#FF3366" />
          <Text style={styles.statsText}>
            {Math.max(0, stepTarget - stepCount)} steps remaining
          </Text>
        </View>
      </View>

      {/* Set Target Inputs */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Set Step Target:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={stepTarget.toString()}
          onChangeText={text => setStepTarget(Number(text))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Set Stride Length (meters):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={strideLength.toString()}
          onChangeText={text => setStrideLength(Number(text))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '25%',
  },
  stepCountText: {
    fontSize: 36,
    color: '#FF3366',
    fontWeight: 'bold',
    marginTop: 10,
  },
  stepGoalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  statsContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', // Updated for better spacing
    alignItems: 'flex-start', // Align items to the top
    flexWrap: 'wrap', // Allow items to wrap
  },
  statItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    flex: 1, // Allow items to take equal space
    maxWidth: '30%', // Limit max width for better responsiveness
  },
  statsText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
});


export default StepCounter;
