/**
 * SAFE TOUR — Trip Itinerary Monitor (React Native + Expo)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { MOCK_TRIP } from '../../src/constants/mockData';

export default function TripScreen() {
  const [selectedDay, setSelectedDay] = useState(MOCK_TRIP.currentDay);
  const currentDay = MOCK_TRIP.days.find(d => d.dayNumber === selectedDay) || MOCK_TRIP.days[2];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.tag}>Day {MOCK_TRIP.currentDay} of {MOCK_TRIP.totalDays} • Active Trip</Text>
          <Text style={styles.tripTitle}>{MOCK_TRIP.title}</Text>
          <Text style={styles.tripSub}>{MOCK_TRIP.startDate} – {MOCK_TRIP.endDate} • {MOCK_TRIP.region}</Text>

          <View style={styles.bento}>
            <View style={styles.bentoItem}>
              <Text style={styles.bentoLabel}>Safety</Text>
              <Text style={styles.bentoVal}>94%</Text>
            </View>
            <View style={styles.bentoItem}>
              <Text style={styles.bentoLabel}>Distance</Text>
              <Text style={styles.bentoVal}>118/284km</Text>
            </View>
            <View style={styles.bentoItem}>
              <Text style={styles.bentoLabel}>Storage</Text>
              <Text style={styles.bentoVal}>Cached</Text>
            </View>
          </View>
        </View>

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
          {MOCK_TRIP.days.map(d => (
            <Pressable
              key={d.dayNumber}
              onPress={() => setSelectedDay(d.dayNumber)}
              style={[
                styles.dayChip,
                selectedDay === d.dayNumber && styles.dayChipActive
              ]}
            >
              <Text style={[styles.dayLabel, selectedDay === d.dayNumber && styles.dayLabelActive]}>
                D{d.dayNumber}
              </Text>
              <Text style={[styles.dayDate, selectedDay === d.dayNumber && styles.dayDateActive]}>
                {d.dateLabel}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Segment Title */}
        <View style={styles.segmentRow}>
          <Text style={styles.segmentTitle}>{currentDay.title}</Text>
          <Text style={styles.segmentSub}>{currentDay.subtitle}</Text>
        </View>

        {/* Stops Timeline */}
        {currentDay.stops.map(stop => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopHeader}>
              <Text style={styles.stopTime}>{stop.timeLabel} • {stop.status}</Text>
              <Text style={styles.stopLocation}>{stop.locationLabel}</Text>
            </View>
            <Text style={styles.stopTitle}>{stop.title}</Text>
            <Text style={styles.stopDesc}>{stop.description}</Text>
            {stop.advisory && (
              <View style={styles.advisoryBox}>
                <Text style={styles.advisoryText}>{stop.advisory}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
  content: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eceef0',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00696d',
    textTransform: 'uppercase',
  },
  tripTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#191c1e',
    marginTop: 2,
  },
  tripSub: {
    fontSize: 12,
    color: '#44474c',
    marginTop: 2,
  },
  bento: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  bentoItem: {
    flex: 1,
    backgroundColor: '#f2f4f6',
    padding: 8,
    borderRadius: 8,
  },
  bentoLabel: {
    fontSize: 10,
    color: '#44474c',
  },
  bentoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#191c1e',
    marginTop: 2,
  },
  daySelector: {
    gap: 8,
    paddingVertical: 4,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eceef0',
    alignItems: 'center',
    minWidth: 64,
  },
  dayChipActive: {
    backgroundColor: '#0e1c2f',
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#191c1e',
  },
  dayLabelActive: {
    color: '#ffffff',
  },
  dayDate: {
    fontSize: 9,
    color: '#44474c',
    marginTop: 2,
  },
  dayDateActive: {
    color: '#bac7e1',
  },
  segmentRow: {
    marginTop: 4,
  },
  segmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1e',
  },
  segmentSub: {
    fontSize: 12,
    color: '#44474c',
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 4,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stopTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00696d',
    textTransform: 'uppercase',
  },
  stopLocation: {
    fontSize: 10,
    color: '#44474c',
  },
  stopTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191c1e',
  },
  stopDesc: {
    fontSize: 12,
    color: '#44474c',
    lineHeight: 16,
  },
  advisoryBox: {
    backgroundColor: '#f2f4f6',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  advisoryText: {
    fontSize: 11,
    color: '#00696d',
  },
});
