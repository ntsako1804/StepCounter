import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { auth } from './firebaseConfig'; // Import auth to access the current user

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = auth.currentUser; // Get the currently logged-in user

  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const leaderboardRef = collection(db, 'leaderboard');
      const q = query(leaderboardRef, orderBy('dailySteps', 'desc')); // Use dailySteps
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLeaderboardData(data);
    } catch (err) {
      setError('Error fetching leaderboard data. Please try again later.');
      console.error('Error fetching leaderboard data: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboardData().then(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3366" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No leaderboard data available.</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    const isCurrentUser = currentUser && currentUser.uid === item.id; // Check if this is the current user

    return (
      <View style={[styles.itemContainer, isCurrentUser && styles.currentUserContainer]}>
        <Text style={[styles.rankText, isCurrentUser && styles.currentUserRank]}>{isCurrentUser ? '1' : index + 1}</Text>
        <Text style={[styles.nameText, isCurrentUser && styles.currentUserName]}>{isCurrentUser ? 'You' : item.name}</Text>
        <Text style={[styles.stepText, isCurrentUser && styles.currentUserSteps]}>{item.dailySteps} steps</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3366',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  currentUserContainer: {
    backgroundColor: '#FFEBEE', // Highlight color for the current user
  },
  rankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3366',
  },
  currentUserRank: {
    color: '#D32F2F', // Different color for the current user rank
  },
  nameText: {
    fontSize: 18,
  },
  currentUserName: {
    fontWeight: 'bold', // Bold font for the current user name
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentUserSteps: {
    color: '#D32F2F', // Different color for the current user steps
  },
});

export default LeaderboardScreen;
