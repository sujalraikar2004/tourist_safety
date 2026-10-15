/**
 * SAFE TOUR — Safety Alerts Feed (React Native + Expo)
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
import { alertService } from '../../src/services/alerts/alertService';

export default function AlertsScreen() {
  const [alerts] = useState(alertService.getAlerts());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Alerts</Text>
        <Text style={styles.badge}>{alertService.getUnreadCount()} New</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {alerts.map(item => (
          <View key={item.id} style={styles.alertCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              <Text style={styles.timeText}>{item.timestamp}</Text>
            </View>
            <Text style={styles.category}>{item.category} • {item.severity}</Text>
            <Text style={styles.alertDesc}>{item.description}</Text>
            {item.unitMeta && (
              <View style={styles.unitBox}>
                <Text style={styles.unitTitle}>{item.unitMeta.officer}</Text>
                <Text style={styles.unitSub}>ETA: {item.unitMeta.eta} • {item.unitMeta.channel}</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#191c1e',
  },
  badge: {
    backgroundColor: '#ba1a1a',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#191c1e',
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: '#44474c',
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00696d',
  },
  alertDesc: {
    fontSize: 12,
    color: '#44474c',
    lineHeight: 16,
    marginTop: 2,
  },
  unitBox: {
    backgroundColor: '#f2f4f6',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  unitTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#191c1e',
  },
  unitSub: {
    fontSize: 10,
    color: '#44474c',
  },
});
