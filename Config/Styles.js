import { StyleSheet } from 'react-native';
import { Colors } from './Colors';


export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    padding: 2,
  },
  addTitles: {
    color: Colors.blue,
    fontWeight: 'bold'
  },
  saveAndCancelButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    padding: 1,
    justifyContent: "space-evenly",
    marginVertical: 20,
    height: 65,
  },
  saveAndCancelButtonContainerForVisit: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: "space-evenly",
    marginVertical: 10,
    height: 95,
  },
  text: {
    color: Colors.background
  },
  buttonStyle: {
    width: '50%',
    alignItems: 'center',
  },
  buttonStyleForVisit: {
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.themeColor,
  },
  cancelButton: {
    backgroundColor: Colors.red,
  },
  postListingContainer: {
    flex: 6,
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
  postImageContainerAfterImageClicked: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  imageOptionsContainer: {
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
    flex: 4,
    width: '95%',
    marginBottom: 0,
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
    paddingLeft: 10
  },
  addItemContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 35,
  },
  buttonContainerForVisit: {
    flex: 1,
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
    margin: 10,
  },
  loginSignUpInput: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.blue,
    color: Colors.themeColor,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  locationOrPriceContainer2: {
    flex: 1,
    alignItems: 'flex-end'
  },
  locationOrPriceContainer1: {
    flex: 1,
    alighItems: 'flex-end',
  },
  imageList: {
    flexGrow: 0,
  },
  visitContainer: {
    flex: 10,
    padding: 20,
  },
  visitLocationAndPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  imagesForVisitContainer: {
    flex: 3
  },
  visitDetailsContainer: {
    flex: 3,
  },
  buttonsViewForVisit: {
    flex: 2,
    alignItems: 'center',
  }
})

