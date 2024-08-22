import { StyleSheet, Text, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";
import { AuthContext } from '../Components/AuthContext';


export default function MapHolder({ navigation, houses }) {
  console.log("houses receievd from Home page: ", houses)
  const [response, requestPermission] = Location.useForegroundPermissions()
  const [userLocation, setUserLocation] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null);
  const receievdHousesToDisplayOnMap = houses.length > 0 && houses.some(house => 'latitude' in house && 'longitude' in house);
  const { language } = useContext(AuthContext);

  async function verifyPermission() {
    console.log(response)
    if (response.granted) {
      return true;
    }
    const permissionResponse = await requestPermission()
    console.log("permission response in verifyPermission: ", permissionResponse)
    return permissionResponse.granted;
  }


  async function mapHandler() {
    const hasPermission = await verifyPermission()
    if (!hasPermission) {
      Alert.alert("You need to give permission to use location services")
      return;
    }
    if (hasPermission) {
      try {
        const result = await Location.getCurrentPositionAsync();
        console.log("Location in locateUserHandler: ", result)
        setUserLocation({ latitude: result.coords.latitude, longitude: result.coords.longitude })
      } catch (error) {
        console.log("Location error in locateUserHandler: ", error)
      }
    }

  }

  const handleMarkerPress = (house) => {
    if (selectedMarker === house.id) {
      // navigating to HouseDetails on the second tap
      navigation.navigate('HouseDetails', { house });
      setSelectedMarker(null); // resetting selected marker
    } else {
      // showing title on the first tap
      setSelectedMarker(house.id);
    }
  };

  console.log("user location in Map component: ", userLocation)

  return (
    <>
      {userLocation ? (

        <>
          <MapView
            style={styles.container}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate={userLocation}
              title='You'
            />

            {receievdHousesToDisplayOnMap && houses.filter(house => 'latitude' in house && 'longitude' in house).map((house, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: Number(house.latitude),
                  longitude: Number(house.longitude)
                }}
                title={`C$${house.price}`}
                image={require('../assets/house_location.png')}
                onPress={() => handleMarkerPress(house)}
                // Adding a callout to display the title on first tap
                calloutVisible={selectedMarker === house.id}
              >
              </Marker>
            ))}
          </MapView>
        </>

      ) : (

        <TouchableOpacity style={styles.container} onPress={mapHandler}>
          <Text>{language === 'zh' ? "点击此处查看附近的房源 " : "Click here to check out the listings nearby "}</Text>
        </TouchableOpacity >

      )}
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: '#333',
  }
});
