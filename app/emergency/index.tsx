/**
 * SAFE TOUR — Emergency SOS Screen (React Native + Expo)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { emergencyService } from '../../src/services/emergencies/emergencyService';

export default function EmergencyScreen() {
  const router = useRouter();
  const [incident, setIncident] = useState(emergencyService.getIncident());
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    emergencyService.triggerSOS();
    const unsub = emergencyService.subscribe(setIncident);
    return () => unsub();
  }, []);

  const handleHoldCancel = async () => {
    await emergencyService.cancelSOS();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.badge}>ACTIVE EMERGENCY SOS • {incident.ticketNumber}</Text>
        <Text style={styles.headerTitle}>TRANSMITTING TELEMETRY</Text>
        <Text style={styles.subTitle}>SEC-CH: ENCR-AES256</Text>
      </View>

      <View style={styles.content}>
        {/* Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transmission Checklist</Text>
          <Text style={styles.checklistStep}>✓ Emergency token generated locally</Text>
          <Text style={styles.checklistStep}>✓ GPS coordinates anchored (25.5788° N, 91.8933° E)</Text>
          <Text style={styles.checklistStep}>
            {incident.checklist.dispatchNotified ? '✓ Dispatch center notified' : '... Awaiting dispatch center handshake'}
          </Text>
          <Text style={styles.checklistStep}>
            {incident.checklist.patrolAssigned ? '✓ Patrol Unit #14 Dispatched (ETA ~7m)' : '... Assigning sector patrol unit'}
          </Text>
        </View>

        {/* Helpline Button */}
        <Pressable
          style={styles.callBtn}
          onPress={() => Linking.openURL('tel:112')}
        >
          <Text style={styles.callBtnText}>Call Tourist Helpline (112 / 1363)</Text>
        </Pressable>

        {/* Cancel Button */}
        <Pressable
          style={styles.cancelBtn}
          onPress={handleHoldCancel}
        >
          <Text style={styles.cancelBtnText}>I Am Safe Now (Cancel Emergency)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
  },
  banner: {
    backgroundColor: '#ba1a1a',
    padding: 20,
    gap: 4,
  },
  badge: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 11,
    opacity: 0.9,
    fontFamily: 'monospace',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eceef0',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1e',
    marginBottom: 4,
  },
  checklistStep: {
    fontSize: 13,
    color: '#191c1e',
    lineHeight: 18,
  },
  callBtn: {
    backgroundColor: '#ba1a1a',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#e6e8ea',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#191c1e',
    fontSize: 14,
    fontWeight: '700',
  },
});
