import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

interface WebViewModalProps {
  visible: boolean;
  url: string;
  onClose: () => void;
}

export const WebViewModal: React.FC<WebViewModalProps> = ({
  visible,
  url,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>完了</Text>
          </TouchableOpacity>
          <Text style={styles.title}>GILANTIC PHOTO&apos;s Hub</Text>
        </View>
        {url && (
          <WebView
            source={{ uri: url }}
            style={styles.webview}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={false}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            mixedContentMode="compatibility"
            allowsInlineMediaPlayback={true}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C8C7CC",
    backgroundColor: "#F7F7F7",
  },
  closeButton: {
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "400",
  },
  title: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  webview: {
    flex: 1,
  },
});
