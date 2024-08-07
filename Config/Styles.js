import { StyleSheet } from 'react-native';
import { Colors } from './Colors';


export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    padding: 2,
  },
  button: {
    backgroundColor: Colors.blue,
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.background,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIconContainer: {
    flexDirection: 'row',
    padding: 5,
    margin: 5,
  },
  addScreenContainer: {
    margin: 15,
    flex: 5,
  },
  itemDetailsView: {
    flex: 3,
    justifyContent: 'center'
  },
  addTitles: {
    color: Colors.themeColor,
    fontWeight: 'bold'
  },
  pressedInput: {
    opacity: 0.7,
    color: Colors.shadowColor
  },
  saveAndCancelButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    padding: 2,
    justifyContent: "space-evenly",
    marginVertical: 7
  },
  text: {
    color: Colors.background
  },
  buttonStyle: {
    width: '50%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.themeColor
  },
  cancelButton: {
    backgroundColor: Colors.red
  },
  itemContainerScreen: {
    marginTop: 10,
    paddingTop: 10
  },
  activityItems: {
    justifyContent: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: Colors.themeColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    margin: 5,
    borderRadius: 5,
    width: '80%',
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemPressed: {
    backgroundColor: Colors.themeColor,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    margin: 5,
    borderRadius: 5,
    width: '80%',
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    opacity: 0.7,
    backgroundColor: Colors.shadowColor
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 3,
  },
  isSpecialWarningImage: {
    width: '25%',
    height: '25%',
  },
  activityName: {
    flex: 1,
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 2,
  },
  itemListText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  itemDetailContainer: {
    backgroundColor: Colors.background,
    padding: 3,
  },
  specialItemContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between'
  },
  toggleThemeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleThemeButtonContainer: {
    backgroundColor: Colors.themeColor,
    padding: 15,
    borderRadius: 5,
  },





  postListingContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  postImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
  },
  imageOptionsContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadImageContainer: {
    backgroundColor: Colors.blue,
    color: Colors.background,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 5,
  },
  listingDetailsContainer: {
    flex: 2,
    width: '95%',
  },
  twoListingInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addInput: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.themeColor,
    color: Colors.themeColor,
    marginHorizontal: 5,
    width: 50,
  },
  addItemContainer: {
    margin: 15,
    flexDirection: 'row',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Add some spacing
  },
  checkbox: {
    marginHorizontal: 10,
    borderColor: Colors.blue
  },
  buttonsView: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,                    // Take up all available space
    justifyContent: 'flex-end',  // Align items to the bottom
    marginBottom: 5,
    marginHorizontal: 35,
  },
  editDeleteButtonStyle: {
    margin: 5,
    padding: 5,
    backgroundColor: 'transparent'
  },
  loginSignUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  loginSignUpFieldContainer: {
    width: 200,
    alignContent: "flex-start",
    margin: 10
  },
  loginSignUpInput: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.blue,
    color: Colors.themeColor,
  }

})

