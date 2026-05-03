import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { globalStyles } from '../../../assets/images/constants/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHistoryRequest, RecordActivity } from '../../_utils/api';
import { getToken } from '../../_utils/authStorage';

import { Colors } from '../../../assets/images/constants/Colors';

export default function Record() {
  const [selectedTab, setSelectedTab] = useState<'day' | 'month' | 'year'>('day');
  const [activities, setActivities] = useState<RecordActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setActivities([]); 
    loadHistory();
  }, [selectedTab]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (token) {
        const data = await getHistoryRequest(token, selectedTab);
        setActivities(data);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.containerApp, { paddingTop: insets.top }]}>
      
      {/* Botones de selección */}
      <View style={globalStyles.selectorContainer}>
        {(['day', 'month', 'year'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              globalStyles.selectorButton, 
              selectedTab === tab && globalStyles.selectorButtonActive
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              globalStyles.selectorText, 
              selectedTab === tab && globalStyles.selectorTextActive
            ]}>
              {tab === 'day' ? 'Día' : tab === 'month' ? 'Mes' : 'Año'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={globalStyles.contentSectionB}>
        <Text style={globalStyles.sectionTitle}>Actividades</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {activities.length > 0 ? (
              activities.map((item) => (
                <View key={item.id} style={globalStyles.listItem}>
                  <View>
                    <Text style={globalStyles.itemDescription}>
                      {item.description}
                    </Text>
                    
                    <Text style={{ 
                        color: item.type === 'Aprendizaje' ? Colors.confirmBg : Colors.positiveBg, 
                        fontWeight: 'bold', 
                        fontSize: 12,
                        marginVertical: 2
                    }}>
                        {item.type.toUpperCase()}
                    </Text>
                    
                    <Text style={globalStyles.itemDate}>{item.date}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>
                No hay actividades registradas en este periodo.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}