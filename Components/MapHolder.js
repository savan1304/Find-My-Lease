import { StyleSheet, Text, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";


export default function MapHolder({ houses }) {
  console.log("houses receievd from Home page: ", houses)
  const [response, requestPermission] = Location.useForegroundPermissions()
  const [userLocation, setUserLocation] = useState(null)
  const receievdHousesToDisplayOnMap = houses.length > 0 && houses.some(house => 'latitude' in house && 'longitude' in house);

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
                  latitude: house.latitude,
                  longitude: house.longitude
                }}
                title={`C$${house.price}`}
                image={require('../assets/house_location.png')}
              >
              </Marker>
            ))}
          </MapView>
          <Text>Location permission granted</Text>
        </>

      ) : (

        <TouchableOpacity style={styles.container} onPress={mapHandler}>
          <Text>Click here to check out the listings nearby</Text>
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
    borderRadius: 5
  }
});
