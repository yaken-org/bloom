import { type CameraType, CameraView } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraPreview() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const { squareSize, squareTop, squareLeft } = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const squareSize = Math.min(screenWidth, screenHeight) * 0.95;
    const squareTop = (screenHeight - squareSize) / 2;
    const squareLeft = (screenWidth - squareSize) / 2;
    return { squareSize, squareTop, squareLeft };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      // 撮影
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Original Photo URI:", photo.uri);

      // 正方形にトリミング
      const { width, height } = photo;
      const cropSize = Math.min(width, height);
      const cropped = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: (width - cropSize) / 2,
              originY: (height - cropSize) / 2,
              width: cropSize,
              height: cropSize,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
      );

      // 保存
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(cropped.uri);
        Alert.alert("Saved!", "Photo saved to your gallery.");
      } else {
        Alert.alert(
          "Permission denied",
          "Cannot save photo without permission.",
        );
      }

      setPhotoUri(cropped.uri);
      console.log("Cropped Photo URI:", cropped.uri);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setPhotoUri(null)}
        >
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing={facing}
      ratio="1:1"
    >
      <View style={StyleSheet.absoluteFillObject}>
        {/* 上 */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: squareTop,
            backgroundColor: "black",
          }}
        />
        {/* 下 */}
        <View
          style={{
            position: "absolute",
            top: squareTop + squareSize,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          }}
        />
        {/* 左 */}
        <View
          style={{
            position: "absolute",
            top: squareTop,
            left: 0,
            width: squareLeft,
            height: squareSize,
            backgroundColor: "black",
          }}
        />
        {/* 右 */}
        <View
          style={{
            position: "absolute",
            top: squareTop,
            left: squareLeft + squareSize,
            width: squareLeft,
            height: squareSize,
            backgroundColor: "black",
          }}
        />
        {/* 正方形フレーム */}
        <View
          style={[
            styles.square,
            {
              top: squareTop,
              left: squareLeft,
              width: squareSize,
              height: squareSize,
            },
          ]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>📸</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        >
          <Text style={styles.text}>🔄</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
  square: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: { marginHorizontal: 20, padding: 10 },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  previewImage: { width: 300, height: 300, borderRadius: 20 },
});
