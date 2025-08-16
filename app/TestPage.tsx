import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import FilterView, { FilterViewRef } from '@/components/FilterView';
import FilterControls from '@/components/FilterControls';
import { useFilterState } from '@/hooks/useFilterState';

/**
 * TestPage - 新しいフィルターシステムのリファレンス実装
 * 
 * このコンポーネントは、新しいフィルターアーキテクチャの使用方法を示すリファレンスとして機能します。
 * 
 * 主な特徴:
 * - FilterFactory による動的フィルター管理
 * - useFilterState フックによる状態管理の簡素化
 * - 拡張可能なアーキテクチャ
 * - 後方互換性の維持
 * 
 * 使用例:
 * 1. 画像選択
 * 2. フィルターの動的適用
 * 3. フィルター順序の変更
 * 4. 画像保存
 */
const TestPage: React.FC = () => {
  // 画像関連の状態
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
  
  // フィルター状態をカスタムフックで管理
  const {
    filterStates,
    filterOrder,
    activeFilters,
    toggleFilter,
    setFilterOrder,
    setFilterOptions,
    getFilterOptions,
    getAllFilterOptions,
  } = useFilterState();
  
  // FilterViewの参照
  const filterViewRef = useRef<FilterViewRef>(null);

  /**
   * メイン画像選択ハンドラー
   */
  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'パーミッション必要',
          'カメラロールにアクセスするには写真へのアクセス許可が必要です。'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', '画像の選択に失敗しました。');
      console.error('Image picker error:', error);
    }
  };

  /**
   * オーバーレイ画像選択ハンドラー
   */
  const handleSelectOverlayImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'パーミッション必要',
          'カメラロールにアクセスするには写真へのアクセス許可が必要です。'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setOverlayImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('エラー', 'オーバーレイ画像の選択に失敗しました。');
      console.error('Overlay image picker error:', error);
    }
  };

  /**
   * 画像保存ハンドラー
   */
  const handleSaveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'パーミッション必要',
          '画像を保存するにはメディアライブラリへのアクセス許可が必要です。'
        );
        return;
      }

      const snapshot = filterViewRef.current?.makeImageSnapshot();
      if (!snapshot) {
        Alert.alert('エラー', '画像のスナップショットを取得できませんでした。');
        return;
      }

      const base64Data = snapshot.encodeToBase64();
      if (!base64Data) {
        Alert.alert('エラー', '画像のエンコードに失敗しました。');
        return;
      }

      const filename = `filtered_image_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Bloom', asset, false);

      Alert.alert(
        '保存完了',
        'フィルター適用済みの画像を写真アルバムに保存しました。',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Save image error:', error);
      Alert.alert('エラー', '画像の保存に失敗しました。');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <StatusBar style="auto" />
      
        <Text style={styles.title}>拡張可能フィルターシステム</Text>
        <Text style={styles.subtitle}>
          動的フィルター管理とプラグアブル設計
        </Text>

        {imageUri ? (
          <>
            {/* 新しいFilterViewを使用 */}
            <FilterView 
              ref={filterViewRef}
              imageUrl={imageUri}
              filters={activeFilters}
              overlayImageUrl={overlayImageUrl || undefined}
              filterOptions={getAllFilterOptions()}
            />
            
            {/* 新しいFilterControlsを使用 */}
            <FilterControls
              filterStates={filterStates}
              filterOrder={filterOrder}
              overlayImageUrl={overlayImageUrl}
              onToggleFilter={toggleFilter}
              onReorderFilter={setFilterOrder}
              onSelectOverlayImage={handleSelectOverlayImage}
              onSetFilterOptions={setFilterOptions}
              getFilterOptions={getFilterOptions}
            />
          
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveImage}
            >
              <Text style={styles.saveButtonText}>
                画像を保存
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              カメラロールから画像を選択してください
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.selectButton}
          onPress={handleSelectImage}
        >
          <Text style={styles.selectButtonText}>
            {imageUri ? '別の画像を選択' : '画像を選択'}
          </Text>
        </TouchableOpacity>

        {/* 実装情報セクション */}
        <View style={styles.implementationInfo}>
          <Text style={styles.implementationTitle}>実装のポイント</Text>
          <Text style={styles.implementationText}>
            {`• FilterFactory: フィルターの登録と動的管理
• FilterStateManager: フィルター状態の一元管理  
• FilterRenderer: 動的フィルター適用エンジン
• useFilterState: フィルター状態管理フック
• 新フィルター追加は FilterFactory.registerFilter() のみ`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderContainer: {
    width: 300,
    height: 225,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  implementationInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  implementationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  implementationText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});

export default TestPage;
