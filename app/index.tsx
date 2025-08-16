import { type CameraType, CameraView } from "expo-camera";
import { useRef, useState, useMemo } from "react";
import {
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
    const squareSize = 300;
    const squareTop = (screenHeight - squareSize) / 2;
    const squareLeft = (screenWidth - squareSize) / 2;
    return { screenWidth, screenHeight, squareSize, squareTop, squareLeft };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      console.log("Photo URI:", photo.uri);
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
    <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
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
