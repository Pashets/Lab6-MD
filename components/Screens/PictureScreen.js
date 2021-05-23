import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Dimensions, Platform, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import PictureSchema from "../Stacks/PictureSchema";

import { MaterialCommunityIcons } from '@expo/vector-icons';


const backColor = "#fff"
const standartBlue = '#2379DD'

const arraySplitter = (arr = [], maxArrSize = 7) => {
    const result = [];
    for (let i = 0; i < Math.ceil(arr.length / maxArrSize); i++) {
        result[i] = arr.slice(i * maxArrSize, (i * maxArrSize) + maxArrSize);
    }
    return result;
};

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function PictureScreen({ navigation }) {

    const [dimensions, setDimensions] = useState({ window, screen });
    const [images, setImages] = useState([]);


    const onChange = ({ window, screen }) => {
        setDimensions({ window, screen });
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('We need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const styles = StyleSheet.create({
        container: {
            marginTop: StatusBar.currentHeight,
            backgroundColor: backColor,
            flex: 1,
            borderWidth: 1,
            borderColor: backColor,

        },

        textContainer: {
            flex: 1,
            marginTop: '10%'
        },

        text: {
            textAlign: 'center',
            backgroundColor: backColor,
            fontSize: 18,
            color: 'black'

        },

        // Add form
        addIcon: {
            textAlign: 'right',
            marginHorizontal: 16,
            marginBottom: 5,
            marginTop: 2,
            color: standartBlue
        },
    });

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={pickImage}>
                    <MaterialCommunityIcons style={styles.addIcon} name="plus" color={'#808082'} size={30} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    useEffect(() => {
        const url = `https://pixabay.com/api/?key=19193969-87191e5db266905fe8936d565&q=red+cars&image_type=photo&per_page=21`;
        (async () => {
            const fetchResult = await fetch(url);
            const loadedData = await fetchResult.json();
            const loadedDataURI = loadedData['hits'].map((loadData) => ({ uri: loadData['largeImageURL'] }));
            setImages(loadedDataURI);
        })();
    }, []);

    const pickImage = async () => {
        let pickedImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!pickedImage.cancelled) {
            setImages(prevState => [...prevState, { uri: pickedImage.uri }])
        }
    };

    const imageSize = {
        width: dimensions.window.width / 5,
        height: dimensions.window.width / 5,
    }

    const PictureSchemaComponent = arraySplitter(images).map(
        image => (
            <PictureSchema
                key={image[0].uri}
                images={image}
                width={imageSize.width}
                height={imageSize.height}
            />
        )
    );

    return (
        <SafeAreaView style={styles.container}>
            {
                images.length === 0 ?
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Картинок не знайдено!</Text>
                </View> : 
                <ScrollView>
                    {PictureSchemaComponent}
                </ScrollView>
            }
        </SafeAreaView>
    );
}

