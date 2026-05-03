import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
  Alert, Modal, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../assets/images/constants/Colors';
import { globalStyles } from '../../../assets/images/constants/globalStyles';

const IDIOMAS = [
  { label: 'Español', code: 'es' },
  { label: 'Inglés', code: 'en' },
  { label: 'Portugués', code: 'pt' },
  { label: 'Francés', code: 'fr' },
  { label: 'Alemán', code: 'de' },
  { label: 'Italiano', code: 'it' },
];

export default function Translator() {
  const insets = useSafeAreaInsets();
  const [texto, setTexto] = useState('');
  const [traduccion, setTraduccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [idiomaOrigen, setIdiomaOrigen] = useState('es');
  const [idiomaDestino, setIdiomaDestino] = useState('en');
  const [modalVisible, setModalVisible] = useState(false);
  const [seleccionando, setSeleccionando] = useState<'origen' | 'destino' | null>(null);

  const abrirModal = (tipo: 'origen' | 'destino') => {
    setSeleccionando(tipo);
    setModalVisible(true);
  };

  const seleccionarIdioma = (code: string) => {
    if (seleccionando === 'origen') setIdiomaOrigen(code);
    else setIdiomaDestino(code);
    setModalVisible(false);
    setSeleccionando(null);
  };

  const intercambiarIdiomas = () => {
    setIdiomaOrigen(idiomaDestino);
    setIdiomaDestino(idiomaOrigen);
    setTexto(traduccion);
    setTraduccion('');
  };

  const traducir = async () => {
    if (!texto.trim()) {
      Alert.alert('Aviso', 'Escribe algo para traducir');
      return;
    }

    if (idiomaOrigen === idiomaDestino) {
      Alert.alert('Aviso', 'Los idiomas de origen y destino deben ser distintos');
      return;
    }

    try {
      setLoading(true);
      setTraduccion('');

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${idiomaOrigen}|${idiomaDestino}&de=traductor@kollaborate.com`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200) {
        const matches = data.matches || [];
        const mejorMatch = matches
          .filter((m: any) =>
            m.translation.toLowerCase() !== texto.toLowerCase() &&
            m.target.startsWith(idiomaDestino)
          )
          .sort((a: any, b: any) => b.quality - a.quality)[0];

        if (mejorMatch) {
          setTraduccion(mejorMatch.translation);
        } else {
          setTraduccion(data.responseData.translatedText);
        }
      } else {
        Alert.alert('Error', 'No se pudo traducir el texto');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión al traducir');
    } finally {
      setLoading(false);
    }
  };

  const labelIdioma = (code: string) =>
    IDIOMAS.find(i => i.code === code)?.label || code;

  return (
    <ScrollView
      style={[globalStyles.containerApp]}
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[globalStyles.headerTitle,{color: Colors.TextprimaryDark}]}>Traductor</Text>

      {/* Selector de idiomas */}
      <View style={styles.idiomasRow}>
        <TouchableOpacity
          style={styles.idiomaBtn}
          onPress={() => abrirModal('origen')}
        >
          <Text style={styles.idiomaBtnText}>{labelIdioma(idiomaOrigen)}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapBtn} onPress={intercambiarIdiomas}>
          <Ionicons name="swap-horizontal" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.idiomaBtn}
          onPress={() => abrirModal('destino')}
        >
          <Text style={styles.idiomaBtnText}>{labelIdioma(idiomaDestino)}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Input texto */}
      <View style={styles.textBox}>
        <TextInput
          style={styles.input}
          placeholder="Escribe el texto a traducir..."
          placeholderTextColor="#aaa"
          value={texto}
          onChangeText={(t) => { setTexto(t); setTraduccion(''); }}
          multiline
          maxLength={500}
        />
        {texto.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => { setTexto(''); setTraduccion(''); }}
          >
            <Ionicons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        <Text style={styles.charCount}>{texto.length}/500</Text>
      </View>

      {/* Botón traducir */}
      <TouchableOpacity
        style={[styles.translateBtn, loading && { opacity: 0.7 }]}
        onPress={traducir}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.translateBtnText}>Traducir</Text>
        }
      </TouchableOpacity>

      {/* Resultado */}
      {traduccion !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>{labelIdioma(idiomaDestino)}</Text>
          <Text style={styles.resultText}>{traduccion}</Text>
        </View>
      )}

      {/* Modal selector de idioma */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {seleccionando === 'origen' ? 'Idioma de origen' : 'Idioma de destino'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={IDIOMAS}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const activo = seleccionando === 'origen'
                  ? idiomaOrigen === item.code
                  : idiomaDestino === item.code;
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, activo && styles.modalItemActivo]}
                    onPress={() => seleccionarIdioma(item.code)}
                  >
                    <Text style={[styles.modalItemText, activo && { color: '#fff' }]}>
                      {item.label}
                    </Text>
                    {activo && <Ionicons name="checkmark" size={18} color="#fff" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  idiomasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  idiomaBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
  },
  idiomaBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  swapBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  textBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    minHeight: 120,
    elevation: 2,
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: Colors.textDark,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  clearBtn: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  charCount: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'right',
    marginTop: 4,
  },
  translateBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  translateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  modalItemActivo: {
    backgroundColor: Colors.primary,
  },
  modalItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});