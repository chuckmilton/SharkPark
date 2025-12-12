import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Button, Card } from '../components';

const HomeScreen: React.FC = () => {
  const handleGetStarted = () => {
    // Navigate to main app or show login
    console.log('Getting started with SharkPark!');
  };

  const handleViewParks = () => {
    // Navigate to parks list
    console.log('Viewing parks...');
  };

  const handleFindNearby = () => {
    // Find nearby parks
    console.log('Finding nearby parks...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="🦈 SharkPark" 
        subtitle="Find and explore amazing parks"
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card title="Welcome to SharkPark!" style={styles.welcomeCard}>
          <Text style={styles.description}>
          </Text>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.primaryButton}
          />
        </Card>

        <Card title="Quick Actions">
          <View style={styles.buttonGroup}>
            <Button
              title="Browse Parks"
              onPress={handleViewParks}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Find Nearby"
              onPress={handleFindNearby}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        </Card>

        <Card title="Featured Parks">
          <Text style={styles.placeholder}>
            🏞️ Featured parks will appear here
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeCard: {
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  primaryButton: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

export default HomeScreen;
